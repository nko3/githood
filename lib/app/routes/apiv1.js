'use strict';

var sf = require('sf');
var fs = require('fs');
var discovery = require('../../discovery');
var config;

module.exports = function (app) {
  config = app.config;
  app.get('/apiv1/repo/:name', getRepo);
  app.post('/apiv1/repo/shared', postShared);
  app.post('/apiv1/repo', postRepo);
  app.delete('/apiv1/repo/:name', removeRepo);
  app.get('/apiv1/notification', sendNotification);
};

function getRepo(req, res, next) {
  var repo = getRepoWithName(req.params.name);
  res.send(repo);
}

function postShared(req, res, next) {
  var repo = getRepoWithName(req.body.name);
  if (!repo) {
    return next(new Error(sf("Failed to update. No repo with name '{0}'.", req.body.name)));
  }

  repo.shared = JSON.parse(req.body.shared);

  config.save();
  if (repo.shared) {
    discovery.repoAvailable(config.server.description, 8001, repo);
  } else {
    discovery.repoUnavailable(8001, repo);
  }
  return res.send('ok')
}

function postRepo(req, res, next) {
  var repo = {
    path: req.body.path,
    name: req.body.name,
    description: req.body.description,
    language: req.body.language,
    watchers: [],
    shared: req.body.shared ? true : false
  };

  if (getRepoWithName(repo.name)) {
    config.repos[getRepoIndex(repo.name)] = repo;
  } else {
    config.repos.push(repo);
  }
  config.save();
  if (repo.shared) {
    discovery.repoAvailable(config.server.description, 8001, repo);
  }
  res.redirect('/');
}

function sendNotification(req, res, next) {
  console.log("sendNotification", req.query);

  var repo = getRepoWithName(req.query.name);
  if (!repo || !repo.shared) {
    return next(new Error(sf("Failed to send notification. No shared repo with name '{0}'.", req.query.name)));
  }

  discovery.repoNotification(8001, repo, req.query.message);

  return res.send("we'll let everybody know\n");
}

function removeRepo(req, res, next) {
  var repo = getRepoWithName(req.params.name);
  config.repos.splice(getRepoIndex(repo.name), 1);
  config.save();
  res.send('ok');
}

function getRepoIndex(name) {
  var index = 0;
  while (config.repos[index].name !== name) {
    index++;
  }
  return index;
}

function getRepoWithName(name) {
  var repos = config.repos.filter(function(r) {
    return r.name === name;
  });
  return repos.length ? repos[0] : null;
}
