'use strict';

var _ = require('lodash');
var request = require('request');

var API = 'https://api.serverpilot.io/v1';

var ServerPilot = function(client_id, client_key) {};

ServerPilot.init = function(client_id, client_key) {
  ServerPilot.client_id = client_id;
  ServerPilot.client_key = client_key;
};

ServerPilot.request = function(resource, id, cb) {
  if(typeof id === 'function') {
    cb = id;
    id = undefined;
  }

  var endpoint = API + '/' + resource;

  if(id !== undefined) {
    endpoint += '/' + id;
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
};

ServerPilot.server = function(id) {
  return {
    create: function(name, cb) {
      if(typeof name !== 'string') {
        throw new Error('Server name is required');
      }

      throw new Error('This endpoint is not yet supported');
    },

    get: function(cb) {
      if(id && typeof id !== 'string') {
        throw new Error('Server id is an optional string');
      }

      ServerPilot.request('servers', id, cb);
    },

    update: function(params, cb) {
      if(typeof id !== 'string') {
        throw new Error('Server id is a required string');
      }

      var data = {};
      params.forEach(function(v, k) {
        if(k === 'firewall') data.firewall = v == 'false' ? false : true;
        if(k === 'autoupdates') data.autoupdates = v == 'false' ? false : true;
      });

      throw new Error('This endpoint is not yet supported');
    },

    delete: function(cb) {
      if(typeof id !== 'string') {
        throw new Error('Server id is a required string');
      }

      throw new Error('This endpoint is not yet supported');
    }
  };
};

ServerPilot.sysuser = function(id) {
  var resource = 'sysusers';

  return {
    create: function(serverId, name, password, cb) {
      if(typeof serverId !== 'string') {
        throw new Error('Server id is a required string');
      }

      if(typeof name !== 'string') {
        throw new Error('Sysuser name is s required string');
      }

      if(typeof password !== 'function') {
        if(typeof password !== 'string') {
          throw new Error('Sysuser password must be a string');
        }
      }

      throw new Error('This endpoint is not yet supported');
    },

    get: function(cb) {
      if(id && typeof id !== 'string') {
        throw new Error('Sysuser id is an optional string');
      }

      ServerPilot.request(resource, id, cb);
    },

    update: function(password, cb) {
      if(typeof id !== 'string') {
        throw new Error('Sysuser id is required');
      }

      if(typeof password !== 'string') {
        throw new Error('Sysuser password is a required string');
      }

      throw new Error('This endpoint is not yet supported');
    },

    delete: function(cb) {
      if(typeof id !== 'string') {
        throw new Error('Sysuser id is required');
      }

      throw new Error('This endpoint is not yet supported');
    }
  };
};

ServerPilot.app = function(id) {
  var resource = 'apps';

  var validRuntimes = ['php5.4', 'php5.5', 'php5.6'];

  return {
    create: function(serverId, name, runtime, domains, cb) {
      if(typeof serverId !== 'string') {
        throw new Error('Server id is a required string');
      }

      if(typeof name !== 'string') {
        throw new Error('App name is s required string');
      }

      if(typeof runtime !== 'string') {
        throw new Error('App untime is a required string');
      }

      if(typeof domains !== 'function') {
        if(typeof domains !== 'object') {
          throw new Error('App domains is an optional array of string');
        }
      }

      throw new Error('This endpoint is not yet supported');
    },

    get: function(cb) {
      if(id && typeof id !== 'string') {
        throw new Error('App id is an optional string');
      }

      ServerPilot.request(resource, id, cb);
    },

    update: function(params, cb) {
      if(typeof id !== 'string') {
        throw new Error('App id is required');
      }

      var data = {};
      params.forEach(function(v, k) {
        if(k === 'runtime') {
          if(!_.indexOf(validRuntimes, v)) {
            throw new Error('App runtime must be [php5.4, php5.5, php5.6]');
          }

          data.runtime = v;
        }

        if(k === 'domains') {
          if(typeof v !== 'object') {
            throw new Error('App domains is an optional array of strings');
          }

          data.domains = v;
        } 
      });

      throw new Error('This endpoint is not yet supported');
    },

    delete: function(cb) {
      if(typeof id !== 'string') {
        throw new Error('App id is required');
      }

      throw new Error('This endpoint is not yet supported');
    },

    //----

    ssl: {

      create: function() {},

      delete: function() {}

    }
  };
};


ServerPilot.db = function(id) {
  var resource = 'dbs';

  return {
    create: function(appId, name, user, cb) {
      if(typeof appId !== 'string') {
        throw new Error('App id is a required string');
      }

      if(typeof name !== 'string') {
        throw new Error('Database name is a required string');
      }

      if(typeof user !== 'object') {
        throw new Error('Database user is a required object');
      }

      if(typeof user.name !== 'string') {
        throw new Error('Database user name is a required string');
      }

      if(typeof user.password !== 'string') {
        throw new Error('Database user password is a required string');
      }

      throw new Error('This endpoint is not yet supported');
    },

    get: function(cb) {
      if(id && typeof id !== 'string') {
        throw new Error('Database id is an optional string');
      }

      ServerPilot.request(resource, id, cb);
    },

    update: function(user, cb) {
      if(typeof id !== 'string') {
        throw new Error('Database id is required');
      }

      if(typeof user !== 'object') {
        throw new Error('Database user is a required object');
      }

      if(typeof user.name !== 'string') {
        throw new Error('Database user name is a required string');
      }

      if(typeof user.password !== 'string') {
        throw new Error('Database user password is a required string');
      }

      throw new Error('This endpoint is not yet supported');
    },

    delete: function(cb) {
      if(typeof id !== 'string') {
        throw new Error('Database id is required');
      }

      throw new Error('This endpoint is not yet supported');
    }
  };
};

ServerPilot.action = function(id) {
  var resource = 'actions';

  return {
    get: function(cb) {
      if(typeof id !== 'string') {
        throw new Error('Action id is required');
      }

      ServerPilot.request(resource, id, cb);
    }
  };
};

module.exports = function(client_id, client_key) {
  ServerPilot.init(client_id, client_key);
  return ServerPilot;
};