import { getAllData } from '../puppeteer/ffvl-scraping-recursive.js';
import { insert, findAll  } from './db/mongoClient.js';

const json = '{"url": "https://federation.ffvl.fr", "html": "je fais du parapente et meme pas peur", "h1": "za aa", "keywords": ["dbgkhju", "blblblbl"], "mostUsedWords": ["test", "jghsngtr"]}';

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
// insert("websitesContent", obj.url, obj.html, obj.h1, obj.keywords, obj.mostUsedWords);

const result = findAll("dbg");
const resArray = [...result];
const excludeIds = resArray.map(doc => doc._id);

const htmlResult = findAllHtml("parapente", { $excludeIds: excludeIds});

