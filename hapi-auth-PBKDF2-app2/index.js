'use strict';

const Hapi = require('hapi');
const myCrypto = require('crypto');
const Joi = require('joi');
//const routes = require('./routes');

const server = new Hapi.Server();
server.connection({ host: '127.0.0.1', port: 1337 });

server.route({
  method: 'POST',
  path: '/negative/pbkdf2/usalt/{password*}',
  handler: function (request, reply) {
    const salt = 'static_salt';
    myCrypto.pbkdf2(request.params.password, request.params.salt, 100000, 512, 'sha512', function (err, hash) {
      if (err) throw err;
      reply(hash.toString('base64'));
    });
  }

});

server.start(function () {});
