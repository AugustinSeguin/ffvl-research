const { Client } = require('elasticsearch');
const client = new Client({
    node: 'http://localhost:9200', // The URL of your Elasticsearch instance
});
module.exports = client;
