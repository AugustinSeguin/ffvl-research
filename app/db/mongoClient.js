const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'ffvlDb';

async function connect() {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);

    db.createCollection("websitesContent", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });

    return { client, db };
}

async function insert(collectionName, url, html, h1, keywords) {
    const { client, db } = await connect();
    try {
        const collection = db.collection(collectionName);
        const result = await collection.insertOne({ url: url, html: html, h1: h1, keywords: keywords });
        console.log('Inserted documents =>', result);
    } finally {
        await client.close();
    }
}

async function findAll(collectionName, query = {}) {
    const { client, db } = await connect();
    try {
        const collection = db.collection(collectionName);
        const documents = await collection.find(query).toArray();
        console.log('Documents found:', documents);
        return documents;
    } finally {
        await client.close();
    }
}

module.exports = { insert, findAll };