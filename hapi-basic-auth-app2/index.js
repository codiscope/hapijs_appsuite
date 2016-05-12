'use strict';

const Hapi = require('hapi');
const Basic = require('hapi-auth-basic');
const bcrypt = require('bcrypt');
const fs = require('fs');
//const Blipp = require('blipp');
const routes = require('./routes');

const server = new Hapi.Server();
server.connection({
  host: '127.0.0.1',
  port: 1337,
  tls: {
    key: fs.readFileSync('/etc/mysslkeys/example.com/privatekey.pem'),
    cert: fs.readFileSync('/etc/mysslkeys/example.com/certificate.pem')
  }
});

server.register([
  Basic
], function (err) {
  if (err) {
    throw err;
  }

  const basicConfig = {
      validateFunc: function (request, username, password, callback) {

          if (username !== 'admin' || password !== 'password') {
              return callback(null, false);
          }

          bcrypt.compare(password, 'password', function (err, isValid) {
            callback(err, isValid, {
              id: user.id,
              name: user.name
            });
          });

          return callback(null, true, { username: 'admin' });
      }
  };

  server.auth.strategy('simple', 'basic', basicConfig);
  server.auth.default('simple');

  //server.route(routes);
  server.route({
    method: 'GET',
    path: '/public',
    config: {
      auth: 'simple',
      handler: function (request, reply) {
        reply('hello, ' + request.auth.credentials.name);
      }
    }
  });
});

server.start(function () {
  console.log('Now Visit: http://localhost:1337');
});
