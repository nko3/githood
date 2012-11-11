var mdns = require('mdns');

module.exports = MdnsAdvertisement;

function MdnsAdvertisement(publicPort, description) {
  this.publicPort = publicPort;
  this.description = description;
}

MdnsAdvertisement.prototype.start = function() {
  var txt_record = { name: 'Githood', description: this.description };
  this.ad = mdns.createAdvertisement(mdns.tcp('http'), this.publicPort, {txtRecord: txt_record});
  this.ad.start();
}

MdnsAdvertisement.prototype.restart = function() {
  var self = this;
  this.ad.stop();
  setTimeout(function() {
    self.start();
  }, 1000);
}