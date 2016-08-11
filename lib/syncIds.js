'use strict';

const {wrap} = require('co');
const getEsClient = require('./getEsClient');

const sourceClient = getEsClient('source');
const destClient = getEsClient('dest');

const syncSingleId = wrap(function *(id) {
  const {_source: complaint} = yield sourceClient.get({
    index: 'pn-complaint',
    type: 'complaint',
    id,
  });

  yield destClient.index({
    index: 'pn-complaint',
    type: 'complaint',
    body: complaint,
  });
});

module.exports = wrap(function *(ids) {
  console.log(`Syncing for complaints: \n${ids.join('\n')}`);

  const failedIds = [];

  yield ids.map((id) => syncSingleId(id).catch((err) => {
    failedIds.push(id);
  }));

  if (failedIds.length) {
    console.log(`Below id failed to sync\n${failedIds.join('\n')}`);
  } else {
    console.log('Syncing successful');
  }
});
