var http = require('http');
var mdns = require('mdns');
var sf = require("sf");
var request = require('request');
var publicApp = require('./lib/publicApp');
var privateApp = require('./lib/privateApp');
var browser = require('./lib/browser');

http.createServer(publicApp).listen(publicApp.port, function() {
  var txt_record = { name: 'Githood', description: publicApp.config.server.description };
  var ad = mdns.createAdvertisement(mdns.tcp('http'), publicApp.port, {txtRecord: txt_record});
  ad.start();
  console.log("Public Express server listening on http://0.0.0.0:" + publicApp.port);
});

http.createServer(privateApp).listen(privateApp.port, '127.0.0.1', function() {
  console.log("Private Express server listening on http://127.0.0.1:" + privateApp.port);
});


//var gitHttp = new GitHttp();
//gitHttp.on('pull', function(pull) { pull.allow(); });
//gitHttp.on('push', function(pull) { pull.deny(); });

//http.createServer(function(req, res) {
  //gitHttp.handle(req, res);
//}).listen(8002);

var config = require('./lib/config').get();
console.log(config);

var browser = new browser(privateApp.neighbors);
browser.start();
