# greenlightstudio.co — DNS zone before cutover

Source: Squarespace → Domains → DNS Settings, captured by the site owner 2026-09-17.
This is the authoritative reference. Cloudflare's import scan is diffed against
this, never trusted on its own.

Registrar: Squarespace. Nameservers currently: `ns-cloud-a{1..4}.googledomains.com`.

## DNS preset (Squarespace Domain Connect)

| Type | Name | TTL | Data |
|---|---|---|---|
| CNAME | `_domainconnect` | 1 hr | `_domainconnect.domains.squarespace.com` |

Squarespace's own management hook. Becomes inert once nameservers move to
Cloudflare. Not required.

## Custom records

| Type | Name | Priority | TTL | Data | Disposition |
|---|---|---|---|---|---|
| A | `@` | — | 4 hrs | `100.24.208.97` | **REPLACE** → Cloudflare Pages |
| A | `@` | — | 4 hrs | `35.172.94.1` | **REPLACE** → Cloudflare Pages |
| CNAME | `www` | — | 4 hrs | `s.multiscreensite.com` | **REPLACE** → Cloudflare Pages |
| A | `mlcustom` | — | 4 hrs | `34.91.249.129` | **KEEP** — MailerLite |
| MX | `mlcustom` | 10 | 4 hrs | `mail.litesrv.io` | **KEEP** — MailerLite |
| TXT | `mlcustom` | — | 4 hrs | `v=spf1 a mx include:_spf.mlsend.com ?all` | **KEEP** — MailerLite |
| CNAME | `litesrv._domainkey` | — | 4 hrs | `litesrv._domainkey.mlsend.com` | **KEEP** — MailerLite DKIM |
| MX | `@` | 1 | 4 hrs | `aspmx.l.google.com` | **KEEP** — Google Workspace |
| MX | `@` | 5 | 4 hrs | `alt1.aspmx.l.google.com` | **KEEP** |
| MX | `@` | 5 | 4 hrs | `alt2.aspmx.l.google.com` | **KEEP** |
| MX | `@` | 10 | 4 hrs | `alt3.aspmx.l.google.com` | **KEEP** |
| MX | `@` | 10 | 4 hrs | `alt4.aspmx.l.google.com` | **KEEP** |
| TXT | `@` | — | 4 hrs | `v=spf1 include:_spf.google.com include:_spf.mlsend.com ~all` | **KEEP** |
| TXT | `_dmarc` | — | 4 hrs | `v=DMARC1; p=reject; pct=100; rua=mailto:re+xx41yoqcbmf@dmarc.postmarkapp.com` | **KEEP** |
| TXT | `google._domainkey` | — | 4 hrs | DKIM key — **full value below**, the Squarespace UI truncates it | **KEEP** |
| CNAME | `fefnutrlmilj` | — | 4 hrs | `gv-br27qfdwfy2ahf.dv.googlehosted.com` | **KEEP** — Google verification |
| CNAME | `fohf32tb2u27` | — | 4 hrs | `gv-exakl4fmejhr3y.dv.googlehosted.com` | **KEEP** — Google verification |
| CNAME | `krf47dxt6rbr` | — | 4 hrs | `gv-4hzcapc3oywmxc.dv.googlehosted.com` | **KEEP** — Google verification |

## Why this matters more than the earlier audit suggested

My DNS queries before this only probed the apex plus a handful of guessed names.
They found MX, SPF, DKIM and DMARC. They did **not** find:

- the entire `mlcustom` subdomain (A, MX, TXT) — MailerLite's custom sending domain
- `litesrv._domainkey` — MailerLite's DKIM
- the three `gv-*` Google verification CNAMEs, whose names are random strings and
  cannot be discovered by guessing

Sixteen of the nineteen records must survive the move. Only three change.

## Two independent email senders

| Sender | Records it depends on |
|---|---|
| Google Workspace | 5 apex MX, apex SPF include, `google._domainkey` DKIM |
| MailerLite | `mlcustom` A/MX/TXT, `litesrv._domainkey` CNAME, apex SPF include |

DMARC is `p=reject`. If either sender's SPF or DKIM fails to resolve after the
move, its mail **bounces** rather than landing in spam.

## Records that must NOT be copied

- Both apex `A` records (Duda's servers)
- `www` CNAME to `s.multiscreensite.com` (Duda)
- `_domainconnect` (Squarespace management hook, inert after the move)


## Full DKIM value

The Squarespace UI truncates this. Captured live from DNS on 2026-09-22, complete:

```
v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoiz/jap1WyF80+q1+SUMVmTmdk8JRh4ZJJ3Tb1FWjPaKFIMwP5xpcDS1n0ttzWz0OpRQxkZzLYsZVLrClIIfP3021y1+nMfoptOYrCuWZEgnN/LDp0vEmIU4pugLpqYMUxbAk05L5/Tf1QejX8DCRocgdSuC6ThqjTPdnX5KMAL1GIxt9Yfy9urLjqgQ/JULJhiqmsjoGoheZH6q04BOaLWS45WR8if8jcwXGhy69Z6ynCdo8KQ29gHVUZ5tTNqqpvGepN/kO1v7zBZac1peHW2q7IaMmQeDTVlZxUfNsD1HSDf/qbP7CQOAAthDmdx7MhWLUNx4JSgeF5/NY0iFzwIDAQAB
```

A raw snapshot of every record, taken immediately before the cutover, is in
`_archive/dns-snapshot-2026-09-22.txt`. Re-run
`scripts/dns-snapshot.sh` after the move and diff the two.
