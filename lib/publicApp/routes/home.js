'use strict';
var config = require('../../config').get();

var publicGitPort = process.env.PUBLIC_GIT_PORT || config.server.publicGitPort || 8001;

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.render('index', {
      host: req.headers.host.substring(0, req.headers.host.indexOf(':')),
      port: publicGitPort,
      title: "Githood",
      description: app.config.server.description,
      sharedRepos: app.config.repos.filter(function(r) { return r.shared }),
      sections: [
        { href: 'http://localhost:8002', title: 'Administration' }
      ]
    });
  });
};
