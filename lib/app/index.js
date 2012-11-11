var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var fs = require('fs');

var app = module.exports = express();

app.configure(function() {
  app.config = require('../config').get();
  app.neighbors = {};
  app.port = process.env.PRIVATE_PORT || app.config.server.privatePort || 8001;
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('layout', __dirname + '/views/_layout.ejs');
  app.use(expressLayouts);
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

require('./routes')(app);
