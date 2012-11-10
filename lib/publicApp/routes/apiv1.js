'use strict';

module.exports = function (app) {
  app.get('/apiv1/repos', getRepos);

  function getRepos(req, res, next) {
    var sharedRepos = app.config.repos.filter(function(r) {
      return r.shared;
    });
    sharedRepos = sharedRepos.map(function(r) {
      return {
        name: r.name,
        description: r.description,
        language: r.language,
        watcherCount: r.watchers.length
      }
    });
    res.send(sharedRepos);
  }
};
