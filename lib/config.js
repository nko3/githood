var fs = require('fs');
var util = require('util');
var events = require('events');
var path = require('path');

var configPath = process.env.CONFIG || path.join(process.env.HOME, '.githood');

function Config() {
  var config = JSON.parse(fs.readFileSync(configPath));
  Object.keys(config).forEach(function(prop) {
    this[prop] = config[prop];
  }.bind(this));
}
util.inherits(Config, events.EventEmitter);

Config.prototype.save = function() {
  console.info('saving config');
  fs.writeFile(configPath, JSON.stringify(this, null, 2), onWrite);
  function onWrite(err) {
    if (err) {
      return console.error(err);
    }
  }
  this.emit('change', this);
}

exports.get = function() {
  if (typeof(CONFIG) === 'undefined') {
    CONFIG = new Config();
  }
  return CONFIG;
}
