var express = require('express');
var path = require('path');
var fs = require('fs');
var PrependStream = require('../prependStream');

var app = module.exports = express();

app.configure(function(){
  app.config = require('../config').get();
  app.port = process.env.PRIVATE_PORT || 8000;
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger({
    format: 'dev',
    stream: new PrependStream('PublicApp ')
  }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes')(app);
