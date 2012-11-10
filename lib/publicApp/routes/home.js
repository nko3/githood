'use strict';

var os = require('os');

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: "Public App",
      description: app.config.server.description,
      sharedRepos: app.config.repos.filter(function(r) { return r.shared })
    });
  });
};
