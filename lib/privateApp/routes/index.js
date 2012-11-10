var os = require('os');

exports.index = function(app, req, res) {
  res.render('index', {
    title: "Private App",
    config: app.config,
    hostname: os.hostname(),
    neighbors: app.neighbors
  });
};

exports.repo = function(req, res) {
  var repo = req.repo;
  var hostname = os.hostname();
  res.render('repo', {
    title: hostname + '/' + repo.name,
    repo: repo,
    hostname: hostname
  });
};