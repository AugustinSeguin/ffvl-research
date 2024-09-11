const { insert, findAll } = require('./db/mongoClient');

const json = '{"url": "url", "html": "html", "h1": "test", "keywords": "dbgkhju"}';

const obj = JSON.parse(json);

insert("websitesContent", obj.url, obj.html, obj.h1, obj.keywords);

const result = findAll();
console.log(result);