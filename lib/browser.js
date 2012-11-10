var mdns = require('mdns');
var sf = require("sf");
var request = require('request');

module.exports = Browser;

function Browser(neighbors) {
  this.neighbors = neighbors;
  this._mdnsBrowser = mdns.createBrowser(mdns.tcp('http'));
}

Browser.prototype.start = function() {
  var self = this;

  this._mdnsBrowser.on('serviceUp', function(service) {
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

  this._mdnsBrowser.on('serviceDown', function(service) {
    self._remove(service.name);
  });

  this._mdnsBrowser.start();
};

Browser.prototype._add = function(neighbor) {
  console.log("adding neighbor:", neighbor);
  this.neighbors[neighbor.name] = neighbor;
};

Browser.prototype._remove = function(neighbor_name) {
  console.log("removing neighbor:", n);
  delete this.neighbors[neighbor.name];
};
