'use strict';

module.exports = function(dataset){
  return {
    $get: function (request, reply) {
      reply({
        data:dataset
      });
    }
  }
};
