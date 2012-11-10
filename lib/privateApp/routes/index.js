'use strict';

module.exports = function (app) {
  require('./repo')(app);
  require('./home')(app);
};
