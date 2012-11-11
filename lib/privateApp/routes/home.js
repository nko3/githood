'use strict';

var os = require('os');
var discovery = require('../../discovery');
var repos = {};

discovery.on('repoAvailable', function(service) {
  repos[service.repo] = service;
});

discovery.on('repoUnavailable', function(service) {
  delete repos[service.repo];
});

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: "Githood",
      config: app.config,
      hostname: os.hostname(),
      repos: repos,
      sections: [
        { active: true, title: 'Administration' },
        { href: 'http://localhost:8000', title: 'Public' }
      ]
    });
  });
};
