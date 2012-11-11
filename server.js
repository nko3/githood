var http = require('http');
var git = require('./lib/git');
var app = require('./lib/app');
var discovery = require('./lib/discovery');

var config = require('./lib/config').get();
var gitPort = process.env.GIT_PORT || config.server.gitPort || 8000;

var gitServer = http.createServer(git);
gitServer.listen(gitPort, function() {
  console.log("Public Git server listening on http://" + gitServer.address().address + ":" + gitServer.address().port);
});

var appServer = http.createServer(app);
var io = require('socket.io').listen(appServer);

appServer.listen(app.port, '127.0.0.1', function() {
  console.log("Private Express server listening on http://" + appServer.address().address + ":" + appServer.address().port);
});

var sockets = {};
io.sockets.on('connection', function(socket) {
  sockets[socket.id] = socket;
  socket.on('disconnect', function() {
    delete sockets[socket.id];
  });
});

[
  'repoAvailable',
  'repoUnavailable',
  'repoNotification'
].forEach(function(event) {
  discovery.on(event, function(data) {
    Object.keys(sockets).forEach(function(key) {
      var socket = sockets[key];
      socket.emit(event, data);
    });
  });
});

config.repos.forEach(function(repo) {
  if (repo.shared) {
    discovery.repoAvailable(config.server.description, gitPort, repo);
  }
});

process.on('exit', function() {
  config.repos.forEach(function(repo) {
    discovery.repoUnavailable(gitPort, repo);
  });
});
