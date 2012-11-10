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
          console.log(url, 'SUCCESS:', body);
        } else {
          console.log(url, 'ERROR:', error);
        }
      })

      self.neighbors.push(n);
      console.log("service up:", n);
    }
  });

  this._mdnsBrowser.on('serviceDown', function(service) {
    self.neighbors = self.neighbors.filter(function(n) {
      if (n.name === service.name) {
        console.log("service down:", n);
        return false;
      }
      else {
        return true;
      }
    });
  });

  this._mdnsBrowser.start();
};
