import fs from 'fs';
import path from 'path';

// console.log(import.meta);
const basename = path.basename(import.meta.url);
const dirname = path.dirname(import.meta.url).split(path.sep).pop();
const alls = [];

fs.readdirSync(dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function (file) {
    import(`./${file}`);
  });
