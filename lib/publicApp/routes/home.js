'use strict';

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: "Githood",
      description: app.config.server.description,
      gitUrlPrefix: 'tbd',
      sharedRepos: app.config.repos.filter(function(r) { return r.shared }),
      sections: [
        {href: 'http://localhost:8002', title: 'Administration'}
      ]
    });
  });
};
