import * as fs from 'fs';
import * as path from 'path';

// List of directories to ignore
const IGNORE_DIRS = ['.git', 'node_modules', 'coverage', 'build', 'dist'];

// Function to build the directory structure
function buildDirectoryTree(directory, indent = '') {
  let tree = '';

  try {
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    entries.forEach((entry) => {
      // Skip ignored directories
      if (IGNORE_DIRS.includes(entry.name)) return;

      tree += `${indent}${entry.name}\n`;

      if (entry.isDirectory()) {
        tree += buildDirectoryTree(path.join(directory, entry.name), `${indent}  `);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error.message);
  }

  return tree;
}

// Main function to generate and write the tree to a file
function writeTreeToFile(startDirectory, outputFile) {
  console.log(`Generating directory structure for: ${startDirectory}`);
  const tree = buildDirectoryTree(startDirectory);

  try {
    fs.writeFileSync(outputFile, tree, 'utf8');
    console.log(`Directory structure written to: ${outputFile}`);
  } catch (error) {
    console.error(`Error writing to file ${outputFile}:`, error.message);
  }
}

// Starting directory (default to current directory) and output file
const startDirectory = process.argv[2] || '.';
const outputFile = process.argv[3] || 'directory_tree.txt';

writeTreeToFile(startDirectory, outputFile);
