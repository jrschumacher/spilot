'use strict';

var _ = require('lodash');
var request = require('request');

var API = 'https://api.serverpilot.io/v1';

var ServerPilot = function(client_id, client_key) {};

ServerPilot.init = function(client_id, client_key) {
  ServerPilot.client_id = client_id;
  ServerPilot.client_key = client_key;
};

ServerPilot.request = function(endpoint) {

};

ServerPilot.server = function(server) {
  var ENDPOINT = API + '/servers';
  
  return {
    get: function(cb) {
      var endpoint = ENDPOINT;

      if(server !== undefined) {
        endpoint += '/' + server;
      }

      request
        .get(endpoint)
        .auth(ServerPilot.client_id, ServerPilot.client_key)
        .on('response', function(response) {
          if(response.statusCode === 200) {
            response.on('data', function(data) {
              cb(JSON.parse(data).data);
            });
          }
          else {
            response.on('data', function(data) {
              if(data.error && data.error.message) {
                throw new Error(data.error.message);
              }
              else {
                throw new Error(data);
              }
            });
          }
        })
        .on('error', function(err) {
          throw new Error(err);
        });

    }
  };

};

module.exports = function(client_id, client_key) {
  ServerPilot.init(client_id, client_key);
  return ServerPilot;
}