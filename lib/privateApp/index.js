var express = require('express');
var path = require('path');
var fs = require('fs');
var routes = require('./routes');

var app = module.exports = express();

app.configure(function() {
  var config = process.env.CONFIG || path.join(process.env.HOME, '.githood');
  app.config = JSON.parse(fs.readFileSync(config));
  app.neighbors = [];
  app.port = process.env.PRIVATE_PORT || 8001;
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
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

app.param('repo', function(req, res, next, repo) {
  var repoMatches = app.config.repos.filter(function(r) {
    return r.name == repo;
  });
  if (!repoMatches.length) {
    return res.send(404, "Repository hasn't been registered or does not exist.");
  }
  req.repo = repoMatches[0];
  return next();
});

app.get('/repository/:repo', routes.repo);

app.get('/', routes.index.bind(null, app));
