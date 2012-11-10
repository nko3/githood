var http = require('http');
var mdns = require('mdns');

var publicApp = require('./lib/publicApp');
var privateApp = require('./lib/privateApp');

http.createServer(publicApp).listen(publicApp.port, function() {
  var txt_record = { name: 'Githood', description: publicApp.config.server.description };
  var ad = mdns.createAdvertisement(mdns.tcp('http'), publicApp.port, {txtRecord: txt_record});
  ad.start();
  console.log("Public Express server listening on http://0.0.0.0:" + publicApp.port);
});
http.createServer(privateApp).listen(privateApp.port, '127.0.0.1', function() {
  console.log("Private Express server listening on http://127.0.0.1:" + privateApp.port);
});

var browser = mdns.createBrowser(mdns.tcp('http'));
var neighbors = [];

browser.on('serviceUp', function(service) {
  if (service.txtRecord && service.txtRecord.name === 'Githood') {
    var n = {
             name: service.name,
             description: service.txtRecord.description,
             host: service.host,
             port: service.port
            };
    neighbors.push(n);
    console.log("service up:", n);
  }
});
browser.on('serviceDown', function(service) {
  neighbors = neighbors.filter(function(n) {
    if (n.name === service.name) {
      console.log("service down:", n);
      return false;
    }
    else {
      return true;
    }
  });
});

browser.start();
