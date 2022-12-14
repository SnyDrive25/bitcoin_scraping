var express = require('express');
var router = express.Router();
const shell = require('shelljs');
var fs = require('fs');
var Airtable = require('airtable');

router.get('/', function(req, res, next) {
  var btcusd = shell.exec(`curl https://markets.businessinsider.com/currencies/btc-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);
  //var ethusd = shell.exec(`curl https://markets.businessinsider.com/currencies/eth-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);
  //var bnbusd = shell.exec(`curl https://markets.businessinsider.com/currencies/bnb-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);

  var today = new Date();
  var date = '[' + today.getDay() + '/' + today.getMonth() + '/' + today.getFullYear() + ' | ' + today.getHours() + ':' + today.getMinutes() + ']';
  
  fs.appendFileSync('public/file.txt', date + ' ' + btcusd + '\n');
  
  var base = new Airtable({apiKey: 'keyZAgEqSGNdXIWLd'}).base('appJ36ZyaFH4MXA96');

  let data = [];
  
  base('Table 1').select({
    maxRecords: 8,
    view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
  records.forEach(function(record) {
        data.push(record.get('value'));
    });
  fetchNextPage();
  }, function done(err) {
    if (err) { console.error(err); return; }
  });

  console.log("data : ", data);

  res.render('index', { title: 'AutoScrap', currencies: [btcusd, 'btcusd'/*, ethusd, 'ethusd', bnbusd, 'bnbusd'*/], base: data});
});

function curl(url) {
  return 'curl ' + url + ' &> /dev/null &'
}

module.exports = router;
