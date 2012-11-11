'use strict';

var os = require('os');
var mdns = require('../../mdns');
var repos = {};

mdns.on('repoAvailable', function(service) {
  console.log("home up", service);
  repos[service.repo] = service;
});

mdns.on('repoUnavailable', function(service) {
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
