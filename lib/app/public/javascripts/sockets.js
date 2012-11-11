var socket = io.connect('http://localhost:8001');

socket.on('repoAvailable', function (repo) {
  var id = repo.serverAddress + ':' + repo.name;
  console.log(id + ' - is now available');

  var neighbors = $('.neighbors');
  neighbors.append('<div class="repo" id="' + id + '">' + id + '</div>');
});

socket.on('repoUnavailable', function (repo) {
  var id = repo.serverAddress + ':' + repo.name;
  console.log(id + ' - is no longer available');

  var sel = '#' + id.replace(/(\.|:)/g, '\\\\$1');
  console.log(sel);
  var el = $(sel);
  console.log(el);
  el.remove();
});

socket.on('repoNotification', function (repo) {
  var id = repo.serverAddress + ':' + repo.name;
  console.log(id + ' - ' + repo.message);

  var sel = '#' + id.replace(/(\.|:)/g, '\\\\$1');
  console.log(sel);
  var el = $(sel);
  console.log(el);
  el.append('<p>' + repo.message + '</p>');
});

