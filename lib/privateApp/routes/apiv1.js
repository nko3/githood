'use strict';

var sf = require('sf');
var fs = require('fs');

module.exports = function (app) {
  app.post('/apiv1/repo/shared', postShared);

  function postShared(req, res, next) {
    var reposWithName = app.config.repos.filter(function(r) {
      return r.name === req.body.name;
    });
    if (!reposWithName.length) {
      return next(new Error(sf("Failed to update. No repo with name '{0}'.", req.body.name)));
    }
    reposWithName[0].shared = req.body.shared;

    fs.writeFile(app.configLocation, JSON.stringify(app.config, null, 2));
    return res.send('ok')
  }
};

