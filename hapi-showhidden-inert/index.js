'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const port = 1337;

server.connection({
  port: port
});

server.register([
  {
    register: require('inert')
  }
], function (err) {
  if (err) {
    throw err;
  }

  server.route([
    {
      method: 'GET',
      path: '/test/{path*}',
      handler: {
        directory: {
          path: './',
          showHidden: true
        }
      }
    }
  ]);
});

server.start(function () {
  console.log('Now Visit: http://localhost:' + port);
});
