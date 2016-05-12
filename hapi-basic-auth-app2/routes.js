'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/public',
        config: {
          auth: false,
          cors: true
        },
        handler: function (request, reply) {
          reply('Hello World');
        }
    },
    {
        method: 'GET',
        path: '/private',
        config: {
          cors: true,
            handler: function (request, reply) {

                return reply(request.auth);
            }
        }
    }
];
