/**
 * This script updates the version in .env.local based on package.json version
 * It's run automatically when you use `npm version` command
 */

const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

// Define the path to the .env.local file
const envFilePath = path.join(__dirname, '../.env.local');

// Function to update or add version in .env.local
function updateVersion(version) {
  let content = '';
  
  // Read the existing .env.local file if it exists
  if (fs.existsSync(envFilePath)) {
    content = fs.readFileSync(envFilePath, 'utf8');
    
    // Check if NEXT_PUBLIC_APP_VERSION already exists
    if (content.includes('NEXT_PUBLIC_APP_VERSION=')) {
      // Replace the existing version
      content = content.replace(
        /NEXT_PUBLIC_APP_VERSION=.*/,
        `NEXT_PUBLIC_APP_VERSION=${version}`
      );
    } else {
      // Add the version to the file
      content += `\nNEXT_PUBLIC_APP_VERSION=${version}\n`;
    }
  } else {
    // Create a new .env.local file with the version
    content = `NEXT_PUBLIC_APP_VERSION=${version}\n`;
  }
  
  // Write back to the file
  fs.writeFileSync(envFilePath, content);
  
  console.log(`Updated NEXT_PUBLIC_APP_VERSION to ${version} in .env.local`);
}

// Get the version from package.json
const version = pkg.version;

// Update the version in .env.local
updateVersion(version);