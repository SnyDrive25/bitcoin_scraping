var express = require('express');
var router = express.Router();
const shell = require('shelljs');
var fs = require('fs');
//var Airtable = require('airtable');

router.get('/', function(req, res, next) {
  var btcusd = shell.exec(`curl https://markets.businessinsider.com/currencies/btc-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);
  //var ethusd = shell.exec(`curl https://markets.businessinsider.com/currencies/eth-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);
  //var bnbusd = shell.exec(`curl https://markets.businessinsider.com/currencies/bnb-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);

  var today = new Date();
  var date = '[' + today.getDay() + '/' + today.getMonth() + '/' + today.getFullYear() + ' | ' + today.getHours() + ':' + today.getMinutes() + ']';
  
  fs.appendFileSync('public/file.txt', date + ' ' + btcusd + '\n');
  
  /*
  var base = new Airtable({apiKey: 'keyZAgEqSGNdXIWLd'}).base('appJ36ZyaFH4MXA96');
  
  var output = [];

  base('Table 1').select({
      maxRecords: 3,
      view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          output.push(record.get('value') + "\n");
      });
      fetchNextPage();
  
  }, function done(err) {
      if (err) { console.error(err); return; }
  });
  */

  res.render('index', { title: 'AutoScrap', currencies: [btcusd, 'btcusd'/*, ethusd, 'ethusd', bnbusd, 'bnbusd'*/], /*base: output*/ });
});

function curl(url) {
  return 'curl ' + url + ' &> /dev/null &'
}

module.exports = router;
