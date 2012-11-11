var util = require('util');
var events = require('events');
var mdns = require('mdns');

function MDNS() {
  this.ads = {};
  var browser = mdns.createBrowser(mdns.tcp('http'));

  browser.on('serviceUp', function(service) {
    if (service.txtRecord && service.txtRecord.type === 'githood') {
      console.log('serviceUp', service);
      this.emit('serviceUp', service);
    }
  }.bind(this));
  browser.on('serviceDown', function(service) {
    if (service.txtRecord && service.txtRecord.type === 'githood') {
      console.log('serviceDown', service);
      this.emit('serviceDown', service);
    }
  }.bind(this));
  browser.start();
}
util.inherits(MDNS, events.EventEmitter);

MDNS.prototype.advertiseGitRepo = function(name, port, repo) {
  var txtRecord = {
    name: name,
    repo: repo.name,
    description: repo.description,
    language: repo.language,
    watcherCount: repo.watchers.length,
    type: 'githood'
  };
  var ad = mdns.createAdvertisement(mdns.tcp('http'), port, { txtRecord: txtRecord });
  ad.start();
  this.ads[repo.name] = ad;
}

MDNS.prototype.removeGitRepoAdvertisement = function(repo) {
  this.ads[repo.name].stop();
  delete this.ads[repo.name];
}

module.exports = new MDNS();
