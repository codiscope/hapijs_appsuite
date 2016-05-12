'use strict';

module.exports = [
    {
        method: 'GET',
        path: '/public',
        config: {
            auth: false,
            handler: function (request, reply) {

                return reply(request.auth);
            }
        }
    },
    {
        method: 'GET',
        path: '/private',
        config: {
            handler: function (request, reply) {

                return reply(request.auth);
            }
        }
    },
    {
      method: 'GET',
      path: '/negative/pbkdf2/csalt/{password*}',
      config: {
        validate: {
          params: {
            password: Joi.string().max(128).min(8).alphanum()
          }
        },
        handler: function (request, reply) {
          const salt = 'static_salt';
          myCrypto.pbkdf2(request.params.password, salt, 100000, 512, 'sha512', function (err, hash) {
            if (err) throw err;
            reply(hash.toString('base64'));
          });
        }
      }
    }
];
