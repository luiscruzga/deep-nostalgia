# deep-nostalgia

Allows you to animate images using [deep-nostalgia](https://www.myheritage.com/deep-nostalgia) from myheritage

## Installation

Install deep-nostalgia with npm

```bash
  npm install deep-nostalgia
```

## Usage/Examples

Get video as url

```javascript
const DeepNostalgia = require('deep-nostalgia');
const path = require('path');

const deepNostalgia = new DeepNostalgia({
  username: 'YOUR_EMAIL',
  password: 'YOUR_PASS'
});

deepNostalgia.animate({
  image: path.join(__dirname, '/uploads/', 'selfie.jpg')
})
.then(animation => {
  console.log('animation', animation);
})
.catch(err => {
  console.log('ERROR: ', err);
});
```

Get video as base64

```javascript
const DeepNostalgia = require('deep-nostalgia');
const path = require('path');

const deepNostalgia = new DeepNostalgia({
  username: 'YOUR_EMAIL',
  password: 'YOUR_PASS'
});

deepNostalgia.animate({
  image: path.join(__dirname, '/uploads/', 'selfie.jpg'),
  toBase64: true
})
.then(animation => {
  console.log('animation', animation);
})
.catch(err => {
  console.log('ERROR: ', err);
});
```

Response
```
{
    "videoUrl": "https://sites-cf.mhcache.com/e/1/az1zaXRlc192MSZzPWU1NDJhMTM0ZTU1ZjQ3NDRjZTg2NTM2Y...TYUD.mp4",
    "base64": "/9YIUFDSFDSUFUSDFD....."
}
```