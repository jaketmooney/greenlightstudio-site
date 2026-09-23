# Bluehost decommission — findings and decisions

Survey done 23 September 2026. **Nothing has been changed or deleted yet.**
Picking this up later; this file is so the next session starts from facts.

## No deadline

Bluehost "WordPress Plus Hosting" (account 53105621) expires **12 Sep 2028**,
auto-renewal **already off**. Nothing forces action. Domains are registered
elsewhere and expire in 2027 (see below), so no risk of losing a name either.

## What's on the account

Primary domain: `greenlightmarketingsolutions.com` · 7.35 of 20 GB used ·
Phoenix data centre · 5 of 20 website slots used.

| Site | URL | Disposition |
|---|---|---|
| Green Light Studio | greenlightstudio.co | **Dead** — now on Cloudflare, this WP install is orphaned |
| The Descent of the Gods | thedescentofthegods.com | **Move to Cloudflare**, like GLS |
| Chasing the Giants (staging) | chasingthegiants.com/staging/4068 | **Delete** |
| Chiang Mai 4 LIFE | chiangmai4life.com | **Site unimportant, domain matters.** Keep the domain, retire the site |
| Chasing the Giants | chasingthegiants.com | **KEEP** — migrate off Bluehost before Sep 2028 |
| Green Light Studio (old) | greenlightmarketingsolutions.com | **Retire site, 301 to greenlightstudio.co** (may already redirect somewhere — check) |

## Domains — all registered at Squarespace, not Bluehost

Cancelling Bluehost hosting cannot cost a domain.

| Domain | Registrar | Expires |
|---|---|---|
| greenlightmarketingsolutions.com | Squarespace Domains II | 2027-09-05 |
| chasingthegiants.com | Squarespace Domains II | 2027-08-30 |
| thedescentofthegods.com | Squarespace Domains II | 2027-04-07 |
| chiangmai4life.com | Squarespace Domains II | 2027-09-24 |

## Two dependencies that must be handled before cancelling

**1. Bluehost runs the DNS for all four domains.** All use
`ns1.bluehost.com` / `ns2.bluehost.com`, all resolve to the same shared IP
`162.241.226.22`. Cancelling hosting removes DNS, so all four domains would stop
resolving entirely — websites *and* mail, even mail hosted elsewhere.
**Move nameservers to Cloudflare first**, same process as greenlightstudio.co
(see `docs/dns-cutover-runbook.md`).

**2. All four domains route mail through Bluehost cPanel.** Each has
`MX → mail.<domain>`. This includes chasingthegiants.com, which is being kept.

### Mailboxes (cPanel → Email Accounts)

| Mailbox | Used | Disposition |
|---|---|---|
| `greenos0` (System) | 5.11 MB | System account, not a real mailbox |
| `hi@chiangmai4life.com` | 2.6 MB | Retire |
| **`jake@chasingthegiants.com`** | **123.5 MB** | **KEEP — the only one to survive** |
| `jake@greenlightmarketingsolutions.com` | **302 MB / 300 MB — OVER QUOTA** | Retire. Currently rejecting inbound mail. Export first if anything in it matters. |
| `mark@greenlightmarketingsolutions.com` | 21 MB | Retire — confirm with Mark first |

`jake@chasingthegiants.com` needs a new home before cPanel email goes. Options:
move it into Google Workspace as an alias or a second domain, or use a small
dedicated mail host. That decision gates the whole email cleanup.

Also worth checking before deleting anything: **forwarders and the catch-all /
default address**, which can quietly receive mail nobody remembers configuring.

## Suggested order when picking this up

1. **Full cPanel backup** — files *and* databases. These are WordPress sites;
   a file-only backup loses every post, page and setting, which live in MySQL.
2. **Decide where `jake@chasingthegiants.com` goes.** Everything else waits on it.
3. **Move all four domains to Cloudflare DNS**, carrying mail records across
   exactly, one domain at a time.
4. **Retire the mailboxes** once mail is re-homed and verified.
5. **`thedescentofthegods.com` → Cloudflare.** Scope separately: this is real
   WordPress, so if it has many posts the content migration is larger than the
   Duda job was.
6. **Delete the dead sites** — GLS WP install, CTG staging, chiangmai4life site,
   greenlightmarketingsolutions site (leaving a 301).
7. **Migrate chasingthegiants.com** off Bluehost. Deadline Sep 2028.
8. **Cancel the plan.**

## Open questions

- Where should `jake@chasingthegiants.com` live afterwards?
- Does Mark still need `mark@greenlightmarketingsolutions.com`?
- Is anything in the over-quota 302 MB mailbox worth exporting?
- Where does `greenlightmarketingsolutions.com` currently redirect, if anywhere?
