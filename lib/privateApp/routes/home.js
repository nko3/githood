'use strict';

var os = require('os');

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: "Private App",
      config: app.config,
      hostname: os.hostname(),
      neighbors: app.neighbors
    });
  });
};