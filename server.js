var http = require('http');
var discovery = require('./lib/discovery');
var app = require('./lib/app');
var gitServer = require('./lib/gitServer');

var config = require('./lib/config').get();
var gitPort = process.env.GIT_PORT || config.server.gitPort || 8000;

http.createServer(gitServer).listen(gitPort, function() {
  console.log("Public Git server listening on http://0.0.0.0:" + gitPort);
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.port, '127.0.0.1', function() {
  console.log("Private Express server listening on http://127.0.0.1:" + app.port);
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
  'repoUnavailable'
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
