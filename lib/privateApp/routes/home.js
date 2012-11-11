'use strict';

var os = require('os');
var mdns = require('../../mdns');
var repos = {};

mdns.on('serviceUp', function(service) {
  repos[service.txtRecord.name] = service.txtRecord;
  repos[service.txtRecord.name].host = service.host;
  repos[service.txtRecord.name].port = service.port;
});

mdns.on('serviceDown', function(service) {
  delete repos[service.textRecord.name];
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
