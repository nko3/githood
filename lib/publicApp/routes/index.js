'use strict';

module.exports = function (app) {
  require('./apiv1')(app);
  require('./home')(app);
};