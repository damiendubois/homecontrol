/**
 * Main application routes
 */

'use strict';

var path = require('path');
var errors = require('./components/errors');


module.exports = function (app) {


  app.use('/api/user', require('./modules/user/api'));
  app.use('/api/rf', require('./modules/rf'));
  app.use('/api/homedef', require('./modules/homedef'));
  app.use('/api/alarm', require('./modules/alarm/api'));
  // All undefined asset routes should return a 404
  app.route('/:url(components|app|bower_components|fonts)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function (req, res) {
      res.sendFile(path.join(app.get('appPath'), 'index.html'));
    });
};
