var config = require('./config').get();
var GitHttp = require('git-http');
var server = new GitHttp();
var sharedRepos = [];

config.on('change', updateSharedRepos);
updateSharedRepos();

server.on('pull', function(pull) {
  pull.allow();
});
server.on('push', function(push) {
  push.allow();
});

module.exports = function(req, res) {
  server.handle(req, res);
};

function getSharedRepos() {
  return config.repos.filter(function(repo) {
    return repo.shared;
  });
};

function updateSharedRepos() {
  var currentRepos = getSharedRepos();
  sharedRepos.forEach(function(repo) {
    server.removeRepo(repo.name);
  });
  currentRepos.forEach(function(repo) {
    server.addRepo('/' + repo.name, repo.path);
  });
  sharedRepos = currentRepos;
}
