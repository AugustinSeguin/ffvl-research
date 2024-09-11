const elasticsearchClient = require('./elasticsearch-client');
function logError(error) {
    elasticsearchClient.index({
        index: 'your-log-index',
        body: {
            message: error.message,
            timestamp: new Date(),
            // Other relevant data
        },
    })
        .then(response => console.log('Log entry sent to Elasticsearch:', response.result))
        .catch(err => console.error('Error sending log entry:', err));
}
// Usage:
const error = new Error('Something went wrong');
logError(error);
