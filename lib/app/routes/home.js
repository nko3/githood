'use strict';

var os = require('os');
var discovery = require('../../discovery');
var repos = {};

discovery.on('repoAvailable', function(service) {
  repos[service.serverAddress + ':' + service.name] = service;
});

discovery.on('repoUnavailable', function(service) {
  delete repos[service.serverAddress + ':' + service.name];
});

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: "Githood",
      config: app.config,
      repos: repos
    });
  });
};
