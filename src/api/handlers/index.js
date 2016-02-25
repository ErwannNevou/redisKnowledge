'use strict';

module.exports = function(dataset){
  return{
    hello: require('./hello') ,
    links : require('./links')(dataset)
  }
};
