var http = require('http');
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require("body-parser");
var app = express();

var url = 'www.snapdeal.com';
var s = '/search?keyword=';
var word ='Lenovo' //product name (replace ' ' with %20)
// var all = '.pu-details';
var name = '.product-title';
// var cat = '.pu-category';
var price = '.product-price';
// var pdetails = '.pu-usp';
var purl = '.product-image';

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/snapdeal.html');
});

app.post('/snapdeal_scrape', function (req, response) {
  word = req.body.prod
  console.log('Poduct:'+word);
  word = word.replace(/ /g,"%20");
  console.log('Scraping data from Snapdeal URl: '+url + s + word);
  var options = {
      host: url,
      path: s + word,
      headers: {
      'User-Agent': 'request'
    }
  }
  var request = http.request(options, function (res) {
      var code = '';
      res.on('data', function (chunk) {
          code += chunk;
      });
      res.on('end', function () {
          var scraper = cheerio.load(code);
          var scraped = '';
          scraper(name).filter(function() { // scrape name
            var data = scraper(this);
            var read = data.text();
            console.log(read);
            scraped = scraped + read +';';
            });
          scraped = scraped + "\n";
          scraper(price).filter(function() { // scrape price
            var data = scraper(this);
            var read = data.text();
            console.log(read);
            scraped = scraped + read +';';
            });
          scraped = scraped + "\n";
          scraper(purl).filter(function() { // scrape image url
            var data = scraper(this);
            var read = data.attr('data-src');
            if (read == undefined)
              read = data.attr('src');
            console.log(read+"\n");
            scraped = scraped + read + ';';
            });
          scraped = scraped + "\n";
          scraper(purl).filter(function() { // scrape product url
            var data = scraper(this);
            var read = data.parent().attr('href');
            console.log(read+"\n");
            scraped = scraped + read + ';';
            });
          response.send(scraped);
          console.log("..Ending");
      });
  });
  request.on('error', function (e) {
      console.log(e.message);
  });
  request.end();
});

app.listen(3000, function () {
  console.log('Server listening on port 3000!');
});
