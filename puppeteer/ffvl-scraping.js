import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto('https://federation.ffvl.fr',{waitUntil: 'load'});

await page.setViewport({width: 1080, height:1024});

const externalLinks = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a'));

    return anchors
      .map(anchor => anchor.href)
      .filter(href => {
        if(href.includes('ffvl')){
            try {
                const linkUrl = new URL(href);
                return linkUrl.origin !== location.origin;
              } catch (e) {
                return false;
              }
        }
      }).map((url)=>{
        return JSON.stringify({url})
    });
    })

const internalLinks = await page.evaluate(()=>{
    const anchors = Array.from(document.querySelectorAll('a'));
    return anchors
    .map(anchor => anchor.href)
    .filter(href => {
      if(href.includes('ffvl')){
          try {
              const linkUrl = new URL(href);
              return linkUrl.origin === location.origin;
            } catch (e) {
              return false;
            }
      }
    }).map((url)=>{
      return JSON.stringify({url})
  });
    
})

    console.log("external links: " + externalLinks)
    console.log("==================================")
    console.log("internal links: " + internalLinks)

await browser.close();