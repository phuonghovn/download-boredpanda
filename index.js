const puppeteer = require('puppeteer');
var cheerio = require("cheerio");
const download = require("image-downloader");
var fs = require('fs');
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const link = process.argv[2];
    const page = await browser.newPage();
    await page.goto(link);
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);

    let content = await page.content();
    var $ = cheerio.load(content);
    
    var arrImage = [];
    var arrTitle = [];
    $(".post-content")
    .find("div[class='open-list-item open-list-block clearfix']")
    .each(function (i, elem) {
      arrImage[i] = $(this).find('img').attr('srcset');
      arrTitle[i] = $(this).find('h2').text();
    });

    console.log(arrImage);
    console.log(arrTitle);
    await arrImage.forEach(async (e, i) => {
          await download.image({
              url: e,
              dest: './public/boredpanda/' + (i + 1) + '.jpg'
          })
          .then(({ filename, image }) => {
            console.log('File saved to', filename)
          })
          .catch((err) => {
            console.error(err)
          })
      })

      var file = fs.createWriteStream('./public/boredpanda/title.txt');
      file.on('error', function(err) { /* error handling */ });
      arrTitle.forEach(function(v) { file.write(v + '\n'); });
      file.end();
    await browser.close();
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
async function getImage(html){

}