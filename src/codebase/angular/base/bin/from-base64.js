const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, '../src/assets');

const files = fs.readdirSync(directoryPath);

files.filter((file) => /^token\.?.*\.json$/gm.test(file)).forEach(generateTokenFromConfig);

function generateTokenFromConfig(file) {
  const filePath = path.join(directoryPath, file);
  const token = fs.readFileSync(filePath).toString();
  const base64 = JSON.parse(Buffer.from(token.split('').reverse().join(''), 'base64').toString());

  fs.writeFileSync(filePath, JSON.stringify(base64, null, 2));
}
