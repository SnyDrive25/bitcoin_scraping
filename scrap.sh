#! /bin/bash

var="$(curl -s https://markets.businessinsider.com/currencies/btc-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)')"

msg="${var:0:9}"

day=$(date +"%d-%m")
mydate=$(date +"%F - %H:%M")

curl https://api.airtable.com/v0/appJ36ZyaFH4MXA96/Table%201 -H "Authorization: Bearer keyZAgEqSGNdXIWLd"

curl -X POST https://api.airtable.com/v0/appJ36ZyaFH4MXA96/Table%201 -H "Authorization: Bearer keyZAgEqSGNdXIWLd" -H "Content-Type: application/json" --data '{"fields": {"value": "'"$msg"'","date": "'"$mydate"'", "day": "'"$day"'"},"typecast": true}'

curl -s --data chat_id="5716818874" --data-urlencode "text=Valeur actuelle du Bitcoin : $ $msg " "https://api.telegram.org/bot5711757703:AAEK9nWX--WUyD2kPjpgiGTjRNps0zVErJ8/sendMessage?parse_mode"
