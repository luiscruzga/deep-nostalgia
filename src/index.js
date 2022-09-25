const puppeteer = require('puppeteer');
const path = require('path');

class deepNostalgia {
  constructor(args = {}){
    this.username = args.username || '';
    this.password = args.password || '';
    this.headless = args.headless || true;
    this.userDataDir = args.userDataDir || 'deepNostalgiaSession';
    this.url = 'https://www.myheritage.com/deep-nostalgia';
  }

  async makePortrait(image) {
    return await new Promise(async (resolve, reject) => {
      if (this.username === '') return reject('Username must not be empty');
      if (this.password === '') return reject('Password must not be empty');
      if (image === '') return reject('Image must not be empty');
      
      let browser = await puppeteer.launch({
        headless: false,
        userDataDir: this.userDataDir,
        devtools: false,
        ignoreHTTPSErrors: true,
        dumpio: false,
        defaultViewport: null,
        args:['--start-maximized' ]
      });

      browser.on('disconnected', async () => {
        browser = null;
        process.exit(1);
      });

      const page = (await browser.pages())[0];
      await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.110 Chrome/70.0.3538.110 Safari/537.36");
      await page.goto(this.url, {waitUntil: 'load'});
      
      if(!(await this.checkLogin(page))) {
        await this.login(page);
      } else {
        const uploadButton = await page.$('.file_input');
        console.log('image', image);
        await uploadButton.uploadFile(image);
        await page.waitForSelector('.download_video');
        const videoSource = await page.$('.video_player video source');
        const videoUrl = await (await videoSource.getProperty('src')).jsonValue();
        console.log('video', videoUrl);
        
      }
    });
  }

  async checkLogin(page) {
    if ((await page.$('.user_strip .user_strip_end .tooltip_hit_area span.warning')) !== null) return false;
    else return true;
  }

  async login(page) {
    await page.click('.user_strip_end .user_strip_notification .actions .user_strip_item_1');
    //await page.waitForTimeout(3000);
    await page.waitForSelector('#loginForm');
    await page.focus('#loginForm #email');
    await page.type('#loginForm #email', this.username);
    await page.focus('#loginForm #password');
    await page.type('#loginForm #password', this.password);
    await page.waitForTimeout(5000);
    await page.click('#loginPopupButton');
  }

}

module.exports = deepNostalgia;