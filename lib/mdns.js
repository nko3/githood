var util = require('util');
var events = require('events');
var mdns = require('mdns');
var dgram = require('dgram');

var mcastAddress = '224.0.2.25';
var mcastPort = 42525;

function MDNS() {
  var udp = dgram.createSocket('udp4');
  udp.on('message', function(msgBuffer, rinfo) {
    try {
      var msg = JSON.parse(msgBuffer.toString()); 
      if (msg.type === 'githood' && msg.action === 'register') {
        this.emit('serviceUp', msg);
      } else if (msg.type === 'githood' && msg.action === 'unregister') {
        this.emit('serviceDown', msg);
      }
    } catch (ex) {
      console.error(rinfo);
    }
  });
  udp.on('listening', function() {
    udp.setMulticastTTL(128); 
    udp.setMulticastLoopback(true);
    udp.addMembership(mcastAddress);
  });
  udp.bind(mcastPort);
  this.udp = udp;
}
util.inherits(MDNS, events.EventEmitter);

MDNS.prototype.advertiseGitRepo = function(name, port, repo) {
  var msgJson = {
    type: 'githood',
    action: 'register',
    name: name,
    repo: repo.name,
    port: port,
    description: repo.description,
    language: repo.language,
    watcherCount: repo.watchers.length
  };

  var msg = new Buffer(JSON.stringify(msgJson));
  this.udp.send(msg, 0, msg.length, mcastPort, mcastAddress);
}

MDNS.prototype.removeGitRepoAdvertisement = function(port, repo) {
  var msgJson = {
    type: 'githood',
    action: 'unregister',
    repo: repo.name,
    port: port
  };

  var msg = new Buffer(JSON.stringify(msgJson));
  this.udp.send(msg, 0, msg.length, mcastPort, mcastAddress);
}

module.exports = new MDNS();
