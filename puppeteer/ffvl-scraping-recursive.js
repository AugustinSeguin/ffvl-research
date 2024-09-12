import puppeteer from "puppeteer";
import { stopwords } from "./stopwords.js";
import { documentExtensions } from "./extensions.js";

async function extractPageInfo(page) {
  return page.evaluate((stopwords, documentExtensions) => {
    function getMostUsedWords(content) {
      const wordsArray = content.toLowerCase().split(' ');
      const wordCount = {};
      wordsArray.filter((word) => {
        if (word.length > 2 && !stopwords.includes(word)) {
          wordCount[word] = (wordCount[word] || 0) + 1;
          return true;
        }
      });
      const sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

      return sortedWords.slice(0, 3).map(item => item[0]);
    }

    const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText : null;
    const h2 = document.querySelector('h2') ? document.querySelector('h2').innerText : null;
    const content = document.querySelector('body').outerHTML.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').replace('\n', '').replace(/&\s*nbsp;/g, '').replace(/&\s*copy;/g, '').replace(/\$\s*=\s*jQuery;\s*.*$/g, '').replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').trim()
    const url = window.location.href
    return {
      url,
      h1: h1 ? h1 : h2,
      html: content !== '' ? content : null,
      keywords: document.querySelector('meta[name="keywords"]') ? document.querySelector('meta[name="keywords"]').getAttribute('content') : null,
      most_used_words: getMostUsedWords(content).length > 0 ? getMostUsedWords(content) : null,
      isDocument: documentExtensions.some(extension => url.slice(-4).includes(extension)),
      DocumentTitle: documentExtensions.some(extension => url.slice(-4).includes(extension)) ? url.match(/[^\/]+$/g, '')[0] : null,
    };
  }, stopwords, documentExtensions);
}

async function collectAllLinks(page) {
    return await page.evaluate(() => {
        // Récupération de tous les élements <a> de la page
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors
          .map(anchor => anchor.href)
          .filter(href => {
            // Vérifications sur l'URL pour filtrer celles qui ne sont pas utiles
            if(href.includes('ffvl') && (!href.includes('facebook') || !href.includes('twitter') || !href.includes('img'))){
              try{
                const linkUrl = new URL(href);
                return linkUrl.protocol === 'http:' || linkUrl.protocol === 'https:';
              } catch (e){
                return false;
              }
            }
          })
      });
}

// function that fetches all the data from de ffvl websites
export async function getAllData() {
  const browser = await puppeteer.launch({
    //executablePath: '/usr/bin/google-chrome-stable', // Specify the path to your Chrome binary
    headless: true, // Set to false if you want to see the browser UI
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these flags
  });
  const page = await browser.newPage();

  const visitedLinks = new Set();
  const linksToVisit = new Set();

  await page.goto('https://federation.ffvl.fr', { waitUntil: 'load' });

  const initialInfo = await extractPageInfo(page);
  visitedLinks.add(initialInfo);

  let newLinks = await collectAllLinks(page);
  newLinks.forEach(link => linksToVisit.add(link));

  while (linksToVisit.size > 0) {
    const [nextLink] = linksToVisit;
    linksToVisit.delete(nextLink);

    if (visitedLinks.has(nextLink)) continue;

    try {
      await page.goto(nextLink, { waitUntil: 'load', timeout: 30000 });

      newLinks = await collectAllLinks(page);

      const pageInfo = await extractPageInfo(page);
      visitedLinks.add(pageInfo);

      newLinks.forEach(link => {
        if (!visitedLinks.has(link) && !linksToVisit.has(link)) {
          linksToVisit.add(link);
        }
      });
    } catch (error) {
      console.log(`Failed to load ${nextLink}: ${error.message}`);
    }
  }
  await browser.close();

  return Array.from(visitedLinks);
}


