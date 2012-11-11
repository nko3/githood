var http = require('http');
var discovery = require('./lib/discovery');
var privateApp = require('./lib/privateApp');
var gitServer = require('./lib/gitServer');

var config = require('./lib/config').get();
var publicGitPort = process.env.PUBLIC_GIT_PORT || config.server.publicGitPort || 8001;

http.createServer(gitServer).listen(publicGitPort, function() {
  console.log("Public Git server listening on http://0.0.0.0:" + publicGitPort);
});

http.createServer(privateApp).listen(privateApp.port, '127.0.0.1', function() {
  console.log("Private Express server listening on http://127.0.0.1:" + privateApp.port);
});

config.repos.forEach(function(repo) {
  if (repo.shared) {
    discovery.advertiseGitRepo(config.server.description, publicGitPort, repo);
  }
});
