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
  Basic,{register: require('hapi-auth-jwt2')}
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

  server.auth.strategy('jwt', 'jwt', {
    key: 'NeverShareYourSecret', // Never Share your secret key
    validateFunc: function (decoded, request, callback) {
      // do your checks to see if the person is valid
    },
    verifyOptions: {algorithms: ['HS256']} // pick a strong algorithm
  });

  server.auth.default('simple');

  //server.route(routes);
  server.route({
    method: 'GET',
    path: '/public',
    config: {
      auth: 'jwt',
      handler: function (request, reply) {
        reply('hello, ' + request.auth.credentials.name);
      }
    }
  });
});

server.start(function () {
  console.log('Now Visit: http://localhost:1337');
});
