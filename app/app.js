import { getAllData } from '../puppeteer/ffvl-scraping-recursive.js';
import { insert, findAll, findAllHtml } from './db/mongoClient.js';
import express from "express";

const app = express()

const res = await getAllData();
const resArray = [...res];

resArray.forEach(element => {
    const obj = JSON.parse(JSON.stringify(element));
    try {
        insert(obj.url, obj.html, obj.h1, obj.keywords, obj.mostUsedWords);
    } catch (e) {
        console.log('Could not insert: ' + e)
    }
});

async function prioriotaryResults(param, category) {
    return await findAll(param, category);
}

async function secondaryResults(results, param, category) {
    if (needMoreResults) {
        const excludeIds = results.map(doc => doc._id);
        const htmlResult = await findAllHtml(param, category, excludeIds)
    }
}

app.get('/search', (req, res) => {
    let param = req.params['keyword'];
    let category = req.params['category'];

    let results = prioriotaryResults(param, category);
    if (req.params['needMoreResulst']) {
        results = secondaryResults(results, param, category);
    }
    res.send(results);
})

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// TODO 
// return document
