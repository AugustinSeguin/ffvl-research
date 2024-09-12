const mongoose = require('mongoose');

// Connection URL
const url = 'mongodb://mongodb:27017/ffvlDb';

// Database Name
const dbName = 'ffvlDb';

// Connect to MongoDB
(async function () {
    return await mongoose.connect(url)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));
})();

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
async function insert(url, html, h1, keywords, mostUsedWords) {
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

// Function to find all documents by URL, title, or most used words
async function findAll(param, category = null) {
    if (param.length > 2) {
        try {
            let documents = null;
            if (category === null) {
                documents = await WebsiteContent.find({
                    $or: [
                        { url: { $regex: '.*' + param + '.*', $options: 'i' } },
                        { h1: { $regex: '.*' + param + '.*', $options: 'i' } },
                        { mostUsedWords: { $elemMatch: { $regex: '.*' + param + '.*', $options: 'i' } } },
                        { keywords: { $elemMatch: { $regex: '.*' + param + '.*', $options: 'i' } } }
                    ]
                });
            }
            else {
                documents = await WebsiteContent.find({
                    $or: [
                        { url: { $regex: '.*' + param + '.*', $options: 'i' }, category: category },
                        { h1: { $regex: '.*' + param + '.*', $options: 'i' }, category: category },
                        { mostUsedWords: { $elemMatch: { $regex: '.*' + param + '.*', $options: 'i' } }, category: category },
                        { keywords: { $elemMatch: { $regex: '.*' + param + '.*', $options: 'i' } }, category: category }
                    ]
                });
            }
            console.log('Documents found:', documents);
            return documents;
        } finally {
            mongoose.connection.close();
        }
    }
}


// Function to find all documents by URL, title, or most used words
async function findAllHtml(param, category = null, excludeIds = []) {
    if (param.length > 2) {
        try {
            let documents = null;
            if (category === null) {
                documents = await WebsiteContent.find({
                    html: { $regex: '.*' + param + '.*', $options: 'i' },
                    category: category,
                    _id: { $nin: excludeIds }
                });
            }
            else {
                documents = await WebsiteContent.find({
                    html: { $regex: '.*' + param + '.*', $options: 'i' },
                    _id: { $nin: excludeIds }
                });
            }
            console.log('Documents found:', documents);
            return documents;
        } finally {
            mongoose.connection.close();
        }
    }
}


function setCategory(url) {
    const categories = ["federation", "delta", "parapente", "cv", "kite", "boomerang"];

    let category = categories.find((category) => url.includes(category));
    if (category === undefined) {
        category = "Tous les sports";
    }
    console.log(category);
    return category;
}

module.exports = { insert, findAll, findAllHtml };