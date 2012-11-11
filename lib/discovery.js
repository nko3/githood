var util = require('util');
var events = require('events');
var dgram = require('dgram');

var mcastAddress = '224.0.2.25';
var mcastPort = 42525;

function Discovery() {
  var udp = dgram.createSocket('udp4');

  udp.on('message', function(msgBuffer, rinfo) {
    try {
      var msg = JSON.parse(msgBuffer.toString());
      msg.serverAddress = rinfo.address;
      if (msg.type === 'githood') {
        if (msg.status === 'available') {
          this.emit('repoAvailable', msg);
        } else if (msg.status === 'unavailable') {
          this.emit('repoUnavailable', msg);
        } else if (msg.status === 'notification') {
          console.log('repoNotification', msg);
          this.emit('repoNotification', msg);
        }
      }
    } catch (ex) {
      console.error(rinfo, ex);
    }
  }.bind(this));

  udp.on('listening', function() {
    //udp.setMulticastLoopback(false); // default is true, false = don't see yourself
    udp.addMembership(mcastAddress);
  });

  udp.bind(mcastPort);

  this.udp = udp;
}
util.inherits(Discovery, events.EventEmitter);

Discovery.prototype.repoAvailable = function(serverDescription, serverPort, repo) {
  var msgJson = {
    type: 'githood',
    status: 'available',
    name: repo.name,
    description: repo.description,
    language: repo.language,
    watcherCount: repo.watchers.length,
    serverDescription: serverDescription,
    serverPort: serverPort,
  };

  var msg = new Buffer(JSON.stringify(msgJson));
  this.udp.send(msg, 0, msg.length, mcastPort, mcastAddress);
}

Discovery.prototype.repoUnavailable = function(serverPort, repo) {
  var msgJson = {
    type: 'githood',
    status: 'unavailable',
    name: repo.name,
    serverPort: serverPort
  };

  var msg = new Buffer(JSON.stringify(msgJson));
  this.udp.send(msg, 0, msg.length, mcastPort, mcastAddress);
}

Discovery.prototype.repoNotification = function(serverPort, repo, message) {
  var msgJson = {
    type: 'githood',
    status: 'notification',
    name: repo.name,
    serverPort: serverPort,
    message: message
  }

  var msg = new Buffer(JSON.stringify(msgJson));
  this.udp.send(msg, 0, msg.length, mcastPort, mcastAddress);
}

module.exports = new Discovery();
