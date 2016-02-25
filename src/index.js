'use strict';

module.exports = function (packageJson, logger) {
  var config = require('./config')(logger);
  var dataset = require('./dataset/reading.json');
  var createServer = require('./api');

  return function (f) {
    var server = createServer(packageJson, config.api.port, dataset);

    server.register(require('inert'), (err) => {
      assert(err === undefined);
    });

    server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
          directory: {
            path: require('path').resolve(__dirname, './dist')
          }
      }
    });
    
    server.start(function (err) {
      f(err, server, config);
    });
  };
};
