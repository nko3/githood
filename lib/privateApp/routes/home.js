'use strict';

var os = require('os');

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: "Githood",
      config: app.config,
      hostname: os.hostname(),
      neighbors: app.neighbors,
      sections: [
        {active: true, title: 'Administration'},
        {href: 'http://localhost:8000', title: 'Public'}
      ]
    });
  });
};
