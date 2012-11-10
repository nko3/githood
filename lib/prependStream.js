'use strict';

var Writable = require('readable-stream/writable');
var inherits = require('util').inherits;

module.exports = PrependStream;

function PrependStream(prefix, options) {
  this.prefix = prefix || '';
  Writable.call(this, options);
}
inherits(PrependStream, Writable);

PrependStream.prototype._write = function (chunk, callback) {
  console.log(this.prefix + chunk.toString());
  callback();
};