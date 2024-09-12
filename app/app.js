import { getAllData } from '../puppeteer/ffvl-scraping-recursive.js';
import { insert, findAll, findAllHtml } from './db/mongoClient.js';

const express = require('express')
const app = express()

// respond with "hello world" when a GET request is made to the homepage

// const json = '{"url": "https://federation.ffvl.fr", "html": "je fais du parapente et meme pas peur", "h1": "za aa", "keywords": ["dbgkhju", "blblblbl"], "mostUsedWords": ["test", "jghsngtr"]}';

// const res = await getAllData();
// const resArray = [...res];

// resArray.forEach(element => {
//     const obj = JSON.parse(json);
//     try{
//         insert("websitesContent", obj.url, obj.html, obj.h1, obj.keywords, obj.mostUsedWords);
//     } catch(e){
//         console.log('Could not insert: '+ e)
//     }
// });

// // const result = findAll("websitesContent");

// res.forEach(r => {
//     insert(r.url, r.html, r.h1, r.keywords, r.mostUsedWords);
//     console.log(r);
// });


// const obj = JSON.parse(json);
// insert(obj.url, obj.html, obj.h1, obj.keywords, obj.mostUsedWords);

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
