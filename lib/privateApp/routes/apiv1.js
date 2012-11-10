'use strict';

module.exports = function (app) {
  app.post('/apiv1/repo/shared', postShared);
};

function postShared(req, res, next) {
  console.log('req.body', req.body);
  res.send('not implemented yet')
}