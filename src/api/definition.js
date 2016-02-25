'use strict';
var deepExtend = require('deepmerge');

module.exports = function (packageJson) {
  /**
   * Define a new route
   * @param  {Object} options
   * @return {Object} extended `options` with default parameters
   */
  function def(options) {
    return deepExtend({
      tags: ['my-first-nodejs-service'],
      summary: 'not-defined',
      operationId: 'not-defined',
      produces: ['text/html'],
      parameters: []
    }, options);
  }

  return {
    swagger: '2.0',
    schemes: [
            'http'
    ],
    info: {
      title: packageJson.title,
      description: packageJson.description,
      termsOfService: packageJson.tos,
      contact: packageJson.author,
      license: packageJson.license,
      version: packageJson.version
    },
    paths: {
      '/hello': {
        get: def({
          summary: 'Start a new conversation',
          operationId: 'hello-world',
          responses: {
            200: {
              description: 'The conversation started'
            }
          },
          parameters: [{
            'in': 'query',
            name: 'name',
            description: 'user name to start a conversation with',
            required: true,
            type: 'string'
          }]
        })},
        '/links': {
          get: def({
            summary: 'Get list of links',
            operationId: 'links',
            responses: {
              200: {
                description: 'List of links started'
              }
            },
            parameters: []
        })}
    }
  };
};
