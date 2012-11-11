var http = require('http');
var discovery = require('./lib/discovery');
var app = require('./lib/app');
var gitServer = require('./lib/gitServer');

var config = require('./lib/config').get();
var gitPort = process.env.GIT_PORT || config.server.gitPort || 8000;

http.createServer(gitServer).listen(gitPort, function() {
  console.log("Public Git server listening on http://0.0.0.0:" + gitPort);
});

http.createServer(app).listen(app.port, '127.0.0.1', function() {
  console.log("Private Express server listening on http://127.0.0.1:" + app.port);
});

config.repos.forEach(function(repo) {
  if (repo.shared) {
    discovery.advertiseGitRepo(config.server.description, gitPort, repo);
  }
});
