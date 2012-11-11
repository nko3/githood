var mdns = require('mdns');

module.exports = mdnsAdvertiser;

function mdnsAdvertiser(description, publicAppPort) {
  var txtRecord = { name: 'Githood', description: description };
  this.advertisement = mdns.createAdvertisement(mdns.tcp('http'), publicAppPort, { txtRecord: txtRecord });
}

mdnsAdvertiser.prototype.start = function() {
  this.advertisement.start();
}

mdnsAdvertiser.prototype.restart = function() {
  this.advertisement.stop();
  this.advertisement.start();
}
