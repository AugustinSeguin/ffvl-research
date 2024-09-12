const { insert, findAll, findAllByHtml, findAllByTitle } = require('./db/mongoClient');
const { main } = require('../puppeteer/ffvl-scraping-recursive');


const json = '{"url": "https://federation.ffvl.fr", "html": "je fais du parapente et meme pas peur", "h1": "test", "keywords": ["dbgkhju", "blblblbl"], "mostUsedWords": ["test", "jghsngtr"]}';

const obj = JSON.parse(json);

insert("websitesContent", obj.url, obj.html, obj.h1, obj.keywords, obj.mostUsedWords);

// const result = findAll("websitesContent");

// const result = findAllByHtml("websitesContent", "parapente");

// console.log(result);

let res = main();
console.log(res);


res.forEach(r => {
    insert("websitesContent", r.url, r.html, r.h1, r.keywords, r.mostUsedWords);
    console.log(r);
});

