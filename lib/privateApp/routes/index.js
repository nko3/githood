'use strict';

module.exports = function (app) {
  require('./apiv1')(app);
  require('./repo')(app);
  require('./home')(app);
};
