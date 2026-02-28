import { execSync } from 'child_process';

console.log('Removing old lock file...');
execSync('rm -f /vercel/share/v0-project/package-lock.json', { stdio: 'inherit' });

console.log('Regenerating package-lock.json...');
execSync('cd /vercel/share/v0-project && npm install --package-lock-only', { stdio: 'inherit' });

console.log('Lock file regenerated successfully!');
