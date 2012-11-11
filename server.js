var http = require('http');
var mdns = require('mdns');
var publicApp = require('./lib/publicApp');
var privateApp = require('./lib/privateApp');
var mdnsBrowser = require('./lib/mdnsBrowser');
var gitServer = require('./lib/gitServer');
var MdnsAdvertisement = require('./lib/mdnsAdvertisement');

privateApp.ad = new MdnsAdvertisement(publicApp.port, publicApp.config.server.description);
http.createServer(publicApp).listen(publicApp.port, function() {
  privateApp.ad.start();
  console.log("Public Express server listening on http://0.0.0.0:" + publicApp.port);
});

var config = require('./lib/config').get();
var publicGitPort = process.env.PUBLIC_GIT_PORT || config.server.publicGitPort || 8001;
http.createServer(gitServer).listen(publicGitPort, function() {
  console.log("Public Git server listening on http://0.0.0.0:" + publicGitPort);
});

http.createServer(privateApp).listen(privateApp.port, '127.0.0.1', function() {
  console.log("Private Express server listening on http://127.0.0.1:" + privateApp.port);
});

var mdnsBrowser = new mdnsBrowser(privateApp.neighbors);
mdnsBrowser.start();
