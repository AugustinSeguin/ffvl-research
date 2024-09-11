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

    db.createCollection("websitesContent", function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
    });

    return { client, db };
}

async function insert(collectionName, url, html, h1, keywords, mostUsedWords) {
    const { client, db } = await connect();
    try {
        const collection = db.collection(collectionName);
        const result = await collection.insertOne({ url: url, html: html, h1: h1, keywords: keywords, mostUsedWords: mostUsedWords, category: setCategory(url) });
        console.log('Inserted documents =>', result);
    } finally {
        await client.close();
    }
}

async function findAllByTitle(collectionName, param = {}) {
    const { client, db } = await connect();
    try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({ "h1": '/' + param + '/' }).toArray();
        console.log('Documents found:', documents);
        return documents;
    } finally {
        await client.close();
    }
}

async function findAllByUrl(collectionName, param = {}) {
    const { client, db } = await connect();
    try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({ "url": '/' + param + '/' }).toArray();
        console.log('Documents found:', documents);
        return documents;
    } finally {
        await client.close();
    }
}

async function findAllByKeywords(collectionName, param = {}) {
    const { client, db } = await connect();
    try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({ "keywords": '/' + param + '/' }).toArray();
        console.log('Documents found:', documents);
        return documents;
    } finally {
        await client.close();
    }
}

async function findAllByMostUsedWords(collectionName, param = {}) {
    const { client, db } = await connect();
    try {
        const collection = db.collection(collectionName);
        const documents = await collection.find({ "mostUsedWords": '/' + param + '/' }).toArray();
        console.log('Documents found:', documents);
        return documents;
    } finally {
        await client.close();
    }
}

async function findAllByHtml(collectionName, param = {}) {
    const { client, db } = await connect();
    try {
        const regex = new RegExp(/^${param}^/, 'i'); // 'i' pour insensible à la casse
        const query = { ["html"]: regex } ;
        const collection = db.collection(collectionName);
        const documents = await collection.find({ "html" :  new Regex(param) } ).toArray();
        console.log('Documents found:', documents);
        return documents;
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

function setCategory(url) {
    const categories = ["federation", "delta", "parapente", "cv", "kite", "boomerang"];

    return categories.find((category) => url.includes(category));

}

module.exports = { insert, findAll, findAllByHtml, findAllByKeywords, findAllByMostUsedWords, findAllByTitle, findAllByUrl, setCategory };