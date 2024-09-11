import puppeteer from "puppeteer";

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
          });
      });
}

async function getPageInfo(page) {
    const h1 = await page.$eval('.title', h1 => h1.innerHTML);
    const html = await page.content();
    const keywords = await page.evaluate(()=> {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      return metaKeywords ? metaKeywords.getAttribute('content') : null;
    });
    
    return {
      url,
      title: h1,
      html: html.replace('/<[^>]*>/g',''),
      keywords: keywords,
    }
  
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const visitedLinks = new Set();
    const linksToVisit = new Set();
    
    await page.goto('https://federation.ffvl.fr', { waitUntil: 'load' });
  
    let newLinks = await collectAllLinks(page);
    newLinks.forEach(link => linksToVisit.add(link));

    while (linksToVisit.size > 0) {
      const [nextLink] = linksToVisit;
      linksToVisit.delete(nextLink);
  
      if (visitedLinks.has(nextLink)) continue;
      
      visitedLinks.add(nextLink);
      
      try {
        await page.goto(nextLink, { waitUntil: 'load', timeout: 30000 });
  
        newLinks = await collectAllLinks(page);
        
        newLinks.forEach(link => {
          if (!visitedLinks.has(link) && !linksToVisit.has(link)) {
            linksToVisit.add(link);
          }
        });
      } catch (error) {
        console.log(`Failed to load ${nextLink}: ${error.message}`);
      }
    }
  

    console.log([...visitedLinks]);
    console.log([...visitedLinks].length)

    
  
    await browser.close();
  })();

