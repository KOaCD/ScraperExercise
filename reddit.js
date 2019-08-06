const puppeteer = require('puppeteer');

const SUBREDDIT_URL = (reddit) => `http://old.reddit.com/r/${reddit}/`;

const self = {
    browser: null,
    page: null,

    initialize: async (reddit) => {
        self.browser = await puppeteer.launch({
            headless: false
        });
        self.page = await self.browser.newPage();
        /* Go to the subreddit */
        await self.page.goto(SUBREDDIT_URL(reddit), {waitUntil: 'networkidle0'});

    },

    getResults: async() => {
        
        let elements = await self.page.$$('#siteTable > div[class*="thing"]');
        let results = [];

        for(let element of elements) {
            //retrieve data from page
            let title = await element.$eval(('p[class="title"]'), node => node.innerText.trim());
            let rank = await element.$eval(('span[class="rank"]'), node => node.innerText.trim());
            let postTime = await element.$eval(('p[class="tagline "] > time'), node => node.getAttribute('title'));
            let authorUrl = await element.$eval(('p[class="tagline "] > a[class*="author"]'), node => node.getAttribute('href'));
            let authorName = await element.$eval(('p[class="tagline "] > a[class*="author"]'), node => node.innerText.trim());
            let score = await element.$eval(('div[class="score likes"]'), node => node.innerText.trim());
            let comments = await element.$eval(('a[data-event-action="comments"]'), node => node.innerText.trim());

            results.push({
                title,
                rank,
                postTime,
                authorUrl,
                authorName,
                score,
                comments
            })
        }
        return results;
    }
}

module.exports = self;