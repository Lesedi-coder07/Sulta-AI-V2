#!/usr/bin/env node

/**
 * Script to validate Firebase configuration
 * Run with: node scripts/check-firebase-config.js
 */

require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = {
  'Client SDK': [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ],
  'Server SDK (Required for server-side rendering)': [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
  ],
};

let allPresent = true;

console.log('🔍 Checking Firebase Configuration...\n');

for (const [category, vars] of Object.entries(requiredEnvVars)) {
  console.log(`${category}:`);
  for (const varName of vars) {
    const isPresent = !!process.env[varName];
    const status = isPresent ? '✅' : '❌';
    console.log(`  ${status} ${varName}`);
    
    if (!isPresent) {
      allPresent = false;
    }
  }
  console.log('');
}

if (allPresent) {
  console.log('✅ All Firebase environment variables are configured!\n');
  process.exit(0);
} else {
  console.log('❌ Some Firebase environment variables are missing.');
  console.log('📖 See FIREBASE_SETUP.md for setup instructions.\n');
  process.exit(1);
}

