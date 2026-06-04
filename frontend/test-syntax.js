import fs from 'fs';
import { execSync } from 'child_process';

let code = fs.readFileSync('src/pages/Dashboard.jsx', 'utf8');

for (let i = 4; i <= 10; i++) {
  const parens = ')'.repeat(i);
  const testCode = code.replace(/insights\."\)\)\)\)\);/, `insights."${parens};`);
  fs.writeFileSync(`src/pages/Dashboard_test_${i}.jsx`, testCode);
  try {
    execSync(`npx eslint src/pages/Dashboard_test_${i}.jsx`, { stdio: 'ignore' });
    console.log(`Success with ${i} parens!`);
    break;
  } catch (e) {
    console.log(`Failed with ${i} parens`);
  }
}
