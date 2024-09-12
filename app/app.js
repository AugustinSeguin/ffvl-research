import { getAllData } from '../puppeteer/ffvl-scraping-recursive.js';

const json = '{"url": "https://federation.ffvl.fr", "html": "je fais du parapente et meme pas peur", "h1": "test", "keywords": ["dbgkhju", "blblblbl"], "mostUsedWords": ["test", "jghsngtr"]}';

const res = await getAllData()
const resArray = [...res];


resArray.forEach(element => {
    const obj = JSON.parse(json);
    try{
        insert("websitesContent", obj.url, obj.html, obj.h1, obj.keywords, obj.mostUsedWords);
    } catch(e){
        console.log('Could not insert: '+ e)
    }
});

const obj = JSON.parse(json);

// const result = findAll("websitesContent");

res.forEach(r => {
    insert(r.url, r.html, r.h1, r.keywords, r.mostUsedWords);
    console.log(r);
});

