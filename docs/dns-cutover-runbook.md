# DNS cutover runbook

**Planned:** Friday 18 September 2026, morning (Asia/Bangkok)
**Decision:** `greenlightstudio.co` is the primary address. `www` forwards to it.

The site is built, deployed and verified on
`https://greenlightstudio-site.jacob-cd9.workers.dev`. This document covers only
pointing the real domain at it.

## What actually changes

Of the 19 DNS records, **three** change:

| Record | From | To |
|---|---|---|
| `A @` | `100.24.208.97` (Duda) | Cloudflare |
| `A @` | `35.172.94.1` (Duda) | Cloudflare |
| `CNAME www` | `s.multiscreensite.com` (Duda) | forwards to apex |

**The other sixteen must survive unchanged.** They are listed in
`_archive/dns-before.md`, captured from Squarespace before any changes.

## Why this needs care

Two independent services send email as this domain:

- **Google Workspace** — 5 apex MX records, the apex SPF include, `google._domainkey`
- **MailerLite** — the whole `mlcustom` subdomain (A, MX, TXT) plus `litesrv._domainkey`

DMARC is `p=reject`. If either service's SPF or DKIM fails to resolve after the move,
**its mail bounces** rather than landing in spam. Recipients get a delivery failure and
the sender may not immediately notice.

Three Google verification records have random-string names — `fefnutrlmilj`,
`fohf32tb2u27`, `krf47dxt6rbr`. They cannot be rediscovered by guessing. They exist
only in the saved zone file.

## Steps

### 1. Add the domain to Cloudflare — *before* changing anything

Add `greenlightstudio.co` to Cloudflare (Free plan). It scans the existing zone and
imports what it finds. **Do not change nameservers yet.** Nothing is live at this
point; the zone just sits in Cloudflare waiting.

### 2. Diff the imported records against the saved zone

Compare Cloudflare's imported list against `_archive/dns-before.md` line by line. The
scan is good but not exhaustive — it can miss records whose names it has no way to
guess.

Confirm present and character-exact:

- [ ] 5 Google MX records, priorities 1 / 5 / 5 / 10 / 10
- [ ] apex TXT: `v=spf1 include:_spf.google.com include:_spf.mlsend.com ~all`
- [ ] `google._domainkey` TXT — the full key, not truncated
- [ ] `_dmarc` TXT with `p=reject` and the Postmark `rua` address
- [ ] `mlcustom` A → `34.91.249.129`
- [ ] `mlcustom` MX → `mail.litesrv.io`
- [ ] `mlcustom` TXT → `v=spf1 a mx include:_spf.mlsend.com ?all`
- [ ] `litesrv._domainkey` CNAME → `litesrv._domainkey.mlsend.com`
- [ ] `fefnutrlmilj` CNAME → `gv-br27qfdwfy2ahf.dv.googlehosted.com`
- [ ] `fohf32tb2u27` CNAME → `gv-exakl4fmejhr3y.dv.googlehosted.com`
- [ ] `krf47dxt6rbr` CNAME → `gv-4hzcapc3oywmxc.dv.googlehosted.com`

Add by hand anything the scan missed. Delete the two Duda A records and the Duda `www`
CNAME — those are the three being replaced.

### 3. Attach the custom domain in Workers

In the `greenlightstudio-site` Worker → Domains & Routes, add `greenlightstudio.co`.
Cloudflare creates the apex record and issues the certificate.

Then add a redirect so `www` forwards to the apex — either a Bulk Redirect or a
single-rule Redirect Rule, both free.

### 4. Change nameservers at Squarespace

Squarespace → Domains → `greenlightstudio.co` → Domain Nameservers. Replace the four
Google Cloud DNS entries with the two Cloudflare gives you.

**This is the moment the change goes live.** Everything before it is reversible with no
visible effect.

### 5. Wait for propagation

```bash
until curl -s -H 'accept: application/dns-json' \
  "https://dns.google/resolve?name=greenlightstudio.co&type=NS" | grep -q cloudflare; do
  echo "waiting..."; sleep 60
done
echo "Cloudflare nameservers live"
```

Usually minutes; can take a few hours.

### 6. Verify email records survived — **gate, do not skip**

```bash
for q in "greenlightstudio.co:MX" "greenlightstudio.co:TXT" \
         "_dmarc.greenlightstudio.co:TXT" "google._domainkey.greenlightstudio.co:TXT" \
         "mlcustom.greenlightstudio.co:TXT" "litesrv._domainkey.greenlightstudio.co:CNAME"; do
  N="${q%:*}"; T="${q##*:}"
  echo "=== $T $N ==="
  curl -s -H 'accept: application/dns-json' "https://dns.google/resolve?name=$N&type=$T" \
    | tr ',' '\n' | grep '"data"' | sed 's/.*"data"://'
done
```

Diff against `_archive/dns-before.md`.

### 7. Test mail in both directions — **gate**

- Send from `jacob@greenlightstudio.co` to an outside address (Gmail, etc.)
- Reply to it from that address
- Confirm both arrive, and that the received copy shows SPF and DKIM passing
  (Gmail: **Show original**)

If a MailerLite campaign is due, send a test through MailerLite too — it uses a
separate signing path from Google Workspace and can fail independently.

**Do not proceed until mail works both ways.**

### 8. Verify the site

```bash
for p in / /our-work/ /case-studies/forestnet-1-9m-views/; do
  printf '%s  %s\n' "$(curl -s -o /dev/null -w '%{http_code}' -L "https://greenlightstudio.co$p")" "$p"
done
curl -s -o /dev/null -w 'www -> %{redirect_url}\n' https://www.greenlightstudio.co/
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://greenlightstudio.co/jake-take
curl -s -o /dev/null -w '404 check: %{http_code}\n' https://greenlightstudio.co/definitely-not-a-page
```

Expect: 200s, `www` forwarding to the apex, `/jake-take` → `/#contact-2026`, and a
genuine 404 on nonsense.

### 9. Search Console

Submit `https://greenlightstudio.co/sitemap-index.xml`. If the property is currently
registered as `www`, add the non-www property too and set the preferred version.

### 10. Monitor 48 hours, then cancel Duda

Before cancelling, confirm all four:

- [ ] Email sends and receives normally
- [ ] Postmark DMARC digest shows no new failures
- [ ] Search Console shows no crawl-error spike
- [ ] All 26 pages resolve on the live domain

**Only then cancel Duda.** Until that point it is the fallback — reverting the
nameservers at Squarespace restores the old site.

## If something goes wrong

**Mail breaks:** revert nameservers at Squarespace to the four Google Cloud DNS
entries. Mail resumes as propagation completes. Fix the records in Cloudflare, then
retry.

**Site is wrong but mail is fine:** no need to revert DNS. Fix and push; Cloudflare
redeploys in ~50 seconds.

**Everything looks fine but a specific sender fails:** check that sender's SPF include
and DKIM record specifically. Google and MailerLite fail independently.
