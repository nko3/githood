var socket = io.connect('http://localhost:8000');

socket.on('repoAvailable', function (repo) {
  alert('available: ' + repo.name);
});
socket.on('repoUnavailable', function (repo) {
  alert('unavailable: ' + repo.name);
});

