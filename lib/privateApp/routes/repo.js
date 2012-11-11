'use strict';
var os = require('os');

module.exports = function (app) {
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

  app.get('/repository/:repo', function(req, res) {
    var repo = req.repo;
    var hostname = os.hostname();
    res.render('repo', {
      title: hostname + '/' + repo.name,
      repo: repo
    });
  });
};
