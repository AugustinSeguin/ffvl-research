const { insert, findAll } = require('./db/mongoClient');

const json = '{"url": "https://federation.ffvl.fr", "html": "html", "h1": "test", "keywords": ["dbgkhju", "blblblbl"], "mostUsedWords": ["test", "jghsngtr"]}';

const obj = JSON.parse(json);

insert("websitesContent", obj.url, obj.html, obj.h1, obj.keywords, obj.mostUsedWords);

const result = findAll("websitesContent");
console.log(result);