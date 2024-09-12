const mongoose = require('mongoose');

// Connection URL
const url = 'mongodb://mongodb:27017/ffvlDb';

// Database Name
const dbName = 'ffvlDb';

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define a schema
const websiteContentSchema = new mongoose.Schema({
    url: String,
    html: String,
    h1: String,
    keywords: [String],
    mostUsedWords: [String],
    category: String
});

// Create a model
const WebsiteContent = mongoose.model('WebsiteContent', websiteContentSchema);

// Function to insert a document
async function insert(collectionName, url, html, h1, keywords, mostUsedWords) {
    try {
        const websiteContent = new WebsiteContent({
            url: url,
            html: html,
            h1: h1,
            keywords: keywords,
            mostUsedWords: mostUsedWords,
            category: setCategory(url)
        });
        const result = await websiteContent.save();
        console.log('Inserted document =>', result);
    } catch (err) {
        console.error('Error inserting document', err);
    } finally {
        mongoose.connection.close();
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