/**
 * Test runner for spaced repetition system
 * 
 * Usage: npm run test-spaced-repetition [-- test-name]
 * 
 * Examples:
 *   npm run test-spaced-repetition           # Run all tests
 *   npm run test-spaced-repetition -- all    # Run comprehensive test
 *   npm run test-spaced-repetition -- intervals     # Run just the intervals test
 *   npm run test-spaced-repetition -- due-collections  # Run just due collections test
 *   npm run test-spaced-repetition -- email  # Run just email notifications test
 */

import path from 'path';
import { execSync } from 'child_process';

// Get command line arguments
const args = process.argv.slice(2);
const testName = args[0] || 'all';

// Map of test names to file paths
const testFiles: Record<string, string> = {
  'all': './tests/spaced-repetition/test-all.ts',
  'intervals': './tests/spaced-repetition/test-intervals.ts',
  'due-collections': './tests/spaced-repetition/test-due-collections.ts',
  'email': './tests/spaced-repetition/test-email-notifications.ts',
};

// Get the file path for the specified test name
const filePath = testFiles[testName];

if (!filePath) {
  console.error(`❌ Unknown test "${testName}"`);
  console.log('Available tests:');
  Object.keys(testFiles).forEach(name => console.log(`  - ${name}`));
  process.exit(1);
}

// Run the test
console.log(`🚀 Running test: ${testName}`);
console.log('======================');

try {
  execSync(`npx ts-node ${filePath}`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Test failed');
  process.exit(1);
}
