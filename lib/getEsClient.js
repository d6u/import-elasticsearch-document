'use strict';

const elasticsearch = require('elasticsearch');
const conf = require('../conf');

module.exports = function (target) {
  return new elasticsearch.Client({
    hosts: [conf.get(`${target}.elasticsearch.host`)],
    apiVersion: '1.5'
  });
};
