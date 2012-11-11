var socket = io.connect('http://localhost:8001');

socket.on('repoAvailable', function (repo) {
  alert('available: ' + repo.name);
});
socket.on('repoUnavailable', function (repo) {
  alert('unavailable: ' + repo.name);
});

