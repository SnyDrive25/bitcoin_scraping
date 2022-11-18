var express = require('express');
var router = express.Router();
const shell = require('shelljs');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  var btcusd = shell.exec(`curl https://markets.businessinsider.com/currencies/btc-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);
  var ethusd = shell.exec(`curl https://markets.businessinsider.com/currencies/eth-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);
  var bnbusd = shell.exec(`curl https://markets.businessinsider.com/currencies/bnb-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)'`);

  var today = new Date();
  var date = '[' + today.getDay() + '/' + today.getMonth() + '/' + today.getFullYear() + ' | ' + today.getHours() + ':' + today.getMinutes() + ']';
  
  fs.appendFileSync('public/file.txt', date + ' ' + btcusd + '\n');
  
  res.render('index', { title: 'AutoScrap', currencies: [btcusd, 'btcusd', ethusd, 'ethusd', bnbusd, 'bnbusd'] });
});

function curl(url) {
  return 'curl ' + url + ' &> /dev/null &'
}

module.exports = router;
