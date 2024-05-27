// Node.js program to demonstrate the
// fs.unlink() method

// Import the filesystem module
const fs = require('fs');

// Get the files in current directory
// before deletion
getFilesInDirectory();

// Delete example_file.txt
fs.unlink('arquivo.txt', err => {
  if (err) console.log(err);
  else {
    console.log('\nDeleted file: arquivo.txt');

    // Get the files in current directory
    // after deletion
    getFilesInDirectory();
  }
});

// Function to get current filenames
// in directory with specific extension
function getFilesInDirectory() {
  console.log('\nFiles present in directory:');
  let files = fs.readdirSync(__dirname);
  files.forEach(file => {
    console.log(file);
  });
}
