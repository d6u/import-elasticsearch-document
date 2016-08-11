# import-elasticsearch-document

To download remote Elasticsearch document to local.

## Usage

```sh
$ npm install
```

Open `conf.js` update the dest section of the config, change it to the destination you want.

```js
dest: {
  elasticsearch: {
    host: {
      protocol: 'http',
      port: 9200,
      host: 'localhost',
    }
  }
},
```

Then run the `sync-complaints.js` with Node 6, the source Elasticsearch host is provided using environment variables.

```sh
$ env ELASTICSEARCH_HOST=xxx ELASTICSEARCH_PORT=yyy ELASTICSEARCH_AUTH=zzz sync-complaints.js --help
```
