#!/usr/bin/env bash
# Snapshot every record we know about, so the same script can be run before and
# after the nameserver change and the two outputs diffed.
D=greenlightstudio.co
q() { # name type
  printf '%-42s %-6s ' "$1" "$2"
  R=$(curl -s -H 'accept: application/dns-json' "https://dns.google/resolve?name=$1&type=$2" \
      | tr ',' '\n' | grep '"data"' | sed 's/.*"data":"//;s/"[}\]]*$//' | sort | tr '\n' '|')
  [ -z "$R" ] && echo "(none)" || echo "$R"
}

echo "### apex"
q "$D" MX
q "$D" TXT
q "$D" A
echo "### email auth"
q "_dmarc.$D" TXT
q "google._domainkey.$D" TXT
q "litesrv._domainkey.$D" CNAME
echo "### mailerlite sending domain"
q "mlcustom.$D" A
q "mlcustom.$D" MX
q "mlcustom.$D" TXT
echo "### google workspace verification"
q "fefnutrlmilj.$D" CNAME
q "fohf32tb2u27.$D" CNAME
q "krf47dxt6rbr.$D" CNAME
echo "### www + nameservers"
q "www.$D" CNAME
q "$D" NS
