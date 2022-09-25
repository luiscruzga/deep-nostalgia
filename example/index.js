const DeepNostalgia = require('../src/index');
const path = require('path');

const deepNostalgia = new DeepNostalgia({
  username: 'YOUR_EMAIL',
  password: 'YOUR_PASSWORD',
  headless: false
});

deepNostalgia.makePortrait(path.join(__dirname, '/uploads/', 'abuela.jpg'));