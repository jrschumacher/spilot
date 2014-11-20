'use strict';

var fs = require('fs');
var _ = require('lodash');
var ServerPilot = require('./serverpilot');

var HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var CONFIG = '.spilot-conf.json';

var Spilot = function(program) {
  this.program = program;
};

Spilot.writeConfig = function(client_id, client_key, cb) {
  fs.writeFile(HOME + '/' + CONFIG, JSON.stringify({
      client_id: client_id,
      client_key: client_key
    }), function(err) {
      if(err) throw new Error(err);

      cb();
    });
};

Spilot.readConfig = function(cb) {
  fs.readFile(HOME + '/' + CONFIG, 'utf8', function(err, data) {
    if(err) {
      throw new Error(err);
    }

    cb(JSON.parse(data));
  });
};

Spilot.initalizeServerPilot = function(cb) {
  if(this.program.client_id && this.program.client_key) {
    var sp = ServerPilot(this.program.client_id, this.program.client_key);
    cb.call(sp);
  }
  else {
    this.readConfig(function(data) {
      var sp = ServerPilot(data.client_id, data.client_key);
      cb.call(sp);
    })
  }
};

module.exports = function(program) {
  Spilot.program = program;

  return function(cb) {
    Spilot.initalizeServerPilot(cb);
  };
};