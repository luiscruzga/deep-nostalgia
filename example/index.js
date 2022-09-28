const DeepNostalgia = require('../src/index');
const path = require('path');

const deepNostalgia = new DeepNostalgia({
  username: 'YOUR_EMAIL',
  password: 'YOUR_PASS',
  cleanSession: false,
  headless: false
});

deepNostalgia.animate({
  image: path.join(__dirname, '/uploads/', 'abuela2.jpg'),
  toBase64: true
})
.then(animation => {
  console.log('animation', animation);
})
.catch(err => {
  console.log('ERROR: ', err);
})