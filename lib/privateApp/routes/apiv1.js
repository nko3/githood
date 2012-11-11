'use strict';

var sf = require('sf');
var fs = require('fs');
var discovery = require('../../discovery');

module.exports = function (app) {
  app.post('/apiv1/repo/shared', postShared.bind(null, app));
  app.post('/apiv1/create', addRepo.bind(null, app));
};

function postShared(app, req, res, next) {
  console.log("why am i here?")
  var reposWithName = app.config.repos.filter(function(r) {
    return r.name === req.body.name;
  });
  if (!reposWithName.length) {
    return next(new Error(sf("Failed to update. No repo with name '{0}'.", req.body.name)));
  }
  var repo = reposWithName[0];
  repo.shared = JSON.parse(req.body.shared);

  app.config.save();
  if (repo.shared) {
    discovery.advertiseGitRepo(app.config.server.description, 8001, repo);
  } else {
    discovery.removeGitRepoAdvertisement(8001, repo);
  }
  return res.send('ok')
}

function addRepo(app, req, res, next) {
  console.log('req.body', req.body)
  var repo = {
    path: req.body.path,
    name: req.body.name,
    description: req.body.description,
    language: req.body.language,
    watchers: [],
    shared: req.body.shared ? true : false
  };
  app.config.repos.push(repo);
  app.config.save();
  if (repo.shared) {
    discovery.advertiseGitRepo(app.config.server.description, 8001, repo);
  }
  res.redirect('/');
}
