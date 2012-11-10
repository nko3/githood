var http = require('http');
var fs = require('fs');
var mdns = require('mdns');

var publicApp = require('./lib/publicApp');
var privateApp = require('./lib/privateApp');

http.createServer(publicApp).listen(publicApp.get('port'), function() {
  var config = JSON.parse(fs.readFileSync(publicApp.get('config')));
  var txt_record = { name: 'Githood', description: config.server.description };
  var ad = mdns.createAdvertisement(mdns.tcp('http'), publicApp.get('port'), {txtRecord: txt_record});
  ad.start();
  console.log("Public Express server listening on http://0.0.0.0:" + publicApp.get('port'));
});
http.createServer(privateApp).listen(privateApp.get('port'), '127.0.0.1', function() {
  console.log("Private Express server listening on http://127.0.0.1:" + privateApp.get('port'));
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
    console.log("service up:", n.name, n.host, n.port);
  }
});
browser.on('serviceDown', function(service) {
  neighbors = neighbors.filter(function(n) {
    if (n.name === service.name) {
      console.log("service down:", n.name, n.host, n.port);
      return false;
    }
    else {
      return true;
    }
  });
});

browser.start();
