'use strict';

module.exports = function (app) {
  app.get('/apiv1/repos', getRepos);

  function getRepos(req, res, next) {
    res.send(app.config.repos.filter(function(r) {
      return r.shared;
    }));
  }
};