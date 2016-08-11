#!/usr/bin/env node

'use strict';

const program = require('commander');

program
  .option('--ids <id>[,<id>]', 'complaint id', (ids) => ids.split(','))
  .option('--time <start>[..<end>]', `time range to sync`, (range) => range.split('..'), ['60d'])
  .parse(process.argv);

const co = require('co');
const syncIds = require('./lib/syncIds');
const syncTimeRange = require('./lib/syncTimeRange');

(program.ids ? syncIds(program.ids) : syncTimeRange(program.time))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
