'use strict';

const convict = require('convict');

const conf = convict({
  source: {
    elasticsearch: {
      host: {
        protocol: 'https',
        host: {
          env: 'ELASTICSEARCH_HOST',
          default: null,
          format: 'url',
        },
        port: {
          env: 'ELASTICSEARCH_PORT',
          default: null,
          format: 'port',
        },
        auth: {
          env: 'ELASTICSEARCH_AUTH',
          default: null,
          format: String,
        },
      }
    }
  },
  dest: {
    elasticsearch: {
      host: {
        protocol: 'http',
        port: 9200,
        host: 'localhost',
      }
    }
  },
});

conf.validate({strict: true});

module.exports = conf;
