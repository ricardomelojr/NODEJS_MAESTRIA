const fs = require('fs');

fs.readFile('programa.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});

fs.readFile('programa.txt', 'utf8', (err, data) => {
  if (err) console.log(err);
  else console.log(data);
});
