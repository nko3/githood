var express = require('express');
var routes = require('./lib/routes');
var user = require('./lib/routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mdns = require('mdns');

var publicApp = express();
var privateApp = express();

publicApp.configure(function(){
  publicApp.set('config', process.env.CONFIG || process.env.HOME + '/.githood');
  publicApp.set('port', process.env.PUBLIC_PORT || 8000);
  publicApp.set('views', __dirname + '/lib/views');
  publicApp.set('view engine', 'ejs');
  publicApp.use(express.favicon());
  publicApp.use(express.logger('dev'));
  publicApp.use(express.bodyParser());
  publicApp.use(express.methodOverride());
  publicApp.use(publicApp.router);
  publicApp.use(express.static(path.join(__dirname, 'public')));
});
privateApp.configure(function(){
  privateApp.set('config', publicApp.get('config'));
  privateApp.set('port', process.env.PRIVATE_PORT || 8001);
  privateApp.set('views', __dirname + '/views');
  privateApp.set('view engine', 'jade');
  privateApp.use(express.favicon());
  privateApp.use(express.logger('dev'));
  privateApp.use(express.bodyParser());
  privateApp.use(express.methodOverride());
  privateApp.use(privateApp.router);
  privateApp.use(express.static(path.join(__dirname, 'public')));
});

publicApp.configure('development', function(){
  publicApp.use(express.errorHandler());
});
privateApp.configure('development', function(){
  privateApp.use(express.errorHandler());
});

publicApp.get('/', routes.index);
publicApp.get('/users', user.list);

http.createServer(publicApp).listen(publicApp.get('port'), function(){
  var config = JSON.parse(fs.readFileSync(publicApp.get('config')));
  var txt_record = { name: 'Githood', description: config.server.description };
  var ad = mdns.createAdvertisement(mdns.tcp('http'), publicApp.get('port'), {txtRecord: txt_record});
  ad.start();
  console.log("Public Express server listening on http://0.0.0.0:" + publicApp.get('port'));
});
http.createServer(privateApp).listen(privateApp.get('port'), '127.0.0.1', function(){
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
