var mdns = require('mdns');
var sf = require("sf");
var request = require('request');

module.exports = mdnsBrowser;

function mdnsBrowser(neighbors) {
  this.neighbors = neighbors;
  this._browser = mdns.createBrowser(mdns.tcp('http'));
}

mdnsBrowser.prototype.start = function() {
  var self = this;

  this._browser.on('serviceUp', function(service) {
    if (service.txtRecord && service.txtRecord.name === 'Githood') {
      var n = {
               name: service.name,
               description: service.txtRecord.description,
               host: service.host,
               port: service.port,
               repositories: []
              };
      var url = sf("http://{host}:{port}/apiv1/repos", n);

      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          sharedRepos = JSON.parse(body);
          n.repositories = sharedRepos;
          console.log(url, 'SUCCESS:', sharedRepos.length);
        } else {
          console.log(url, 'ERROR:', error);
        }
      })

      self._add(n);
    }
  });

  this._browser.on('serviceDown', function(service) {
    self._remove(service.name);
  });

  this._browser.start();
};

mdnsBrowser.prototype._add = function(neighbor) {
  console.log("adding neighbor:", neighbor);
  this.neighbors[neighbor.name] = neighbor;
};

mdnsBrowser.prototype._remove = function(neighbor_name) {
  console.log("removing neighbor:", neighbor_name);
  delete this.neighbors[neighbor_name];
};
