const fs = require('fs');

const lockfile = JSON.parse(fs.readFileSync('/vercel/share/v0-project/package-lock.json', 'utf-8'));

// Check the resolved version of next
const nextEntry = lockfile.packages['node_modules/next'];
if (nextEntry) {
  console.log('next resolved version:', nextEntry.version);
} else {
  console.log('next entry not found in lock file');
}

// Check eslint-config-next
const eslintEntry = lockfile.packages['node_modules/eslint-config-next'];
if (eslintEntry) {
  console.log('eslint-config-next resolved version:', eslintEntry.version);
} else {
  console.log('eslint-config-next entry not found in lock file');
}

// Check @next/eslint-plugin-next
const pluginEntry = lockfile.packages['node_modules/@next/eslint-plugin-next'];
if (pluginEntry) {
  console.log('@next/eslint-plugin-next resolved version:', pluginEntry.version);
} else {
  console.log('@next/eslint-plugin-next entry not found in lock file');
}
