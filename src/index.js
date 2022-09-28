const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { encode } = require('node-base64-image');

class deepNostalgia {
  constructor(args = {}){
    this.username = args.username || '';
    this.password = args.password || '';
    this.headless = typeof args.headless === 'undefined' ? true : args.headless;
    this.userDataDir = args.userDataDir || 'deepNostalgiaSession';
    this.url = 'https://www.myheritage.com/deep-nostalgia';

    if (args.cleanSession) {
      fs.rmSync(this.userDataDir, { recursive: true, force: true });
    }
  }


  async animate(args) {
    return await new Promise(async (resolve, reject) => {
      if (this.username === '') return reject('Username must not be empty');
      if (this.password === '') return reject('Password must not be empty');
      if (args.image === '') return reject('Image must not be empty');
      let browser = await puppeteer.launch({
        headless: this.headless,
        userDataDir: this.userDataDir,
        devtools: false,
        ignoreHTTPSErrors: true,
        dumpio: false,
        defaultViewport: null,
        args:['--start-maximized' ]
      });

      const page = (await browser.pages())[0];
      await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.110 Chrome/70.0.3538.110 Safari/537.36");
      await page.goto(this.url, {waitUntil: 'load'});
      
      if(!(await this.checkLogin(page))) {
        await this.login(page);

        await page.waitForTimeout(2000);
        if ((await page.$('.reCaptcha div[style*="display:none"]')) === null) {
          if (!this.headless) {
            console.log('Please solve the captcha and press the login button!');
            try {
              await page.waitForSelector('.reCaptcha div[style*="display:none"]');
            } catch (err) {

            }
          } else {
            await browser.close();
            return reject('You must log in manually since the recaptcha must be validated, try running in headless mode false');
          }
        }
      }
      
      try {
        const uploadButton = await page.$('.file_input');
        await uploadButton.uploadFile(args.image);
        await page.waitForSelector('.download_video');
        const videoSource = await page.$('.video_player video source');
        const videoUrl = await (await videoSource.getProperty('src')).jsonValue();
        await browser.close();
        
        if (args.toBase64) {
          const videoBase64 = await encode(videoUrl, { string: true });
          return resolve({
            videoUrl,
            base64: videoBase64
          });
        } else {
          return resolve({videoUrl});
        }
      } catch(err) {
        if ((await page.$('.subscription_paywall')) !== null) {
          await browser.close();
          return reject('You have no more credits to continue!');
        } else {
          await browser.close();
          return reject('Ooops an error has occurred, please try again later!');
        }
      }
      
    });
  }

  async checkLogin(page) {
    if ((await page.$('.user_strip .user_strip_end .tooltip_hit_area span.warning')) !== null) return false;
    else return true;
  }

  async login(page) {    
    await page.click('.user_strip_end .user_strip_notification .actions .user_strip_item_1');
    await page.waitForSelector('#loginForm');
    await page.waitForTimeout(2000);
    await page.focus('#loginForm #email');
    await page.type('#loginForm #email', this.username);
    await page.focus('#loginForm #password');
    await page.type('#loginForm #password', this.password);
    await page.waitForTimeout(3000);
    await page.click('#loginPopupButton');
  }

}

module.exports = deepNostalgia;