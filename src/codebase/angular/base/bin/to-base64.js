const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, '../src/assets');

const files = fs.readdirSync(directoryPath);

files.filter((file) => /^token\.?.*\.json$/gm.test(file)).forEach(generateTokenFromConfig);

function generateTokenFromConfig(file) {
  const filePath = path.join(directoryPath, file);
  const json = fs.readFileSync(filePath).toString();

  if (/[{:}]/.test(json)) {
    const base64 = Buffer.from(json).toString('base64');

    fs.writeFileSync(filePath, `"${base64.split('').reverse().join('')}"`);
  } else {
    throw new TypeError('This config is already JWT encoded');
  }
}
