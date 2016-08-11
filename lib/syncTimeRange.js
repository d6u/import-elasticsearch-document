'use strict';

const {wrap} = require('co');
const {dissoc, flatten} = require('ramda');
const getEsClient = require('./getEsClient');

const sourceClient = getEsClient('source');
const destClient = getEsClient('dest');

module.exports = wrap(function *([start, end = 'now']) {
  console.log(`Syncing for complaints between '${start}' and '${end}'`);

  let count = 0;

  let response = yield sourceClient.search({
    index: 'pn-complaint',
    type: 'complaint',
    scroll: '30s',
    body: {
      sort: {
        timestamp: 'desc'
      },
      size: 100,
      query: {
        filtered: {
          filter: {
            range: {
              timestamp: {
                gte: `now-${start}`,
                lte: end,
              }
            }
          }
        }
      }
    }
  });

  while (true) {
    const complaints = response.hits.hits.map((item) => dissoc('version', item._source));

    count += complaints.length;

    console.log(`Indexing ${count} of ${response.hits.total} complaints`);

    try {
      yield destClient.bulk({
        index: 'pn-complaint',
        type: 'complaint',
        refresh: true,
        body: flatten(complaints.map((c) => [{index: {}}, c])),
      });
    } catch (err) {
      throw err;
    }

    if (count === response.hits.total) {
      break;
    }

    console.log(`Getting more from production`);

    response = yield sourceClient.scroll({
      scrollId: response._scroll_id,
      scroll: '30s'
    });
  }

  console.log(`Finshed indexing ${count} complaints`);
});
