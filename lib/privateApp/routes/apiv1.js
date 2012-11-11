'use strict';

var sf = require('sf');
var fs = require('fs');

module.exports = function (app) {
  app.post('/apiv1/repo/shared', postShared.bind(null, app));
  app.post('/apiv1/create', addRepo.bind(null, app));
};

function postShared(app, req, res, next) {
  var reposWithName = app.config.repos.filter(function(r) {
    return r.name === req.body.name;
  });
  if (!reposWithName.length) {
    return next(new Error(sf("Failed to update. No repo with name '{0}'.", req.body.name)));
  }
  reposWithName[0].shared = JSON.parse(req.body.shared);

  app.config.save();
  app.ad.restart();
  return res.send('ok')
}

function addRepo(app, req, res, next) {
  console.log('req.body', req.body)
  app.config.repos.push({
    path: req.body.path,
    name: req.body.name,
    description: req.body.description,
    language: req.body.language
  });
  app.config.save();
  app.ad.restart();
  res.redirect('/');
}