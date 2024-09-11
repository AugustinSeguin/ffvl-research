import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto('https://federation.ffvl.fr',{waitUntil: 'load'});Ò

await page.setViewport({width: 1080, height:1024});

const title = await page.$eval('.title', h1 => h1.innerHTML);

console.log('title: '+title)
await browser.close();