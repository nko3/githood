var express = require('express');
var routes = require('./lib/routes');
var user = require('./lib/routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mdns = require('mdns');


var app = express();

app.configure(function(){
  app.set('config', process.env.CONFIG || process.env.HOME + '/.githood');
  app.set('port', process.env.PORT || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  var config = JSON.parse(fs.readFileSync(app.get('config')));
  var txt_record = { name: 'Githood', description: config.server.description };
  var ad = mdns.createAdvertisement(mdns.tcp('http'), app.get('port'), {txtRecord: txt_record});
  ad.start();
  console.log("Express server listening on http://0.0.0.0:" + app.get('port'));
});
