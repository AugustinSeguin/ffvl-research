import puppeteer from "puppeteer";

async function extractPageInfo(page) {
  return page.evaluate(() => {
    const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText : null;
    const h2 = document.querySelector('h2') ? document.querySelector('h2').innerText : null;
    return {
      url: window.location.href,
      h1: h1 ? h1 : h2,
      html: document.querySelector('body').outerHTML.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').replace('\n','').replace(/&\s*nbsp;/, '').replace(/&\s*copy;/, '').replace(/\$\s*=\s*jQuery;\s*.*$/,'').replace(/[^a-zA-Z0-9À-ÿ\s]/,'').trim(), 
      keywords: document.querySelector('meta[name="keywords"]') ? document.querySelector('meta[name="keywords"]').getAttribute('content') : null,
    };
  });
}

async function collectAllLinks(page) {
    return await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors
          .map(anchor => anchor.href)
          .filter(href => {
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

(async () => {
    const browser = await puppeteer.launch();
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
  })();

