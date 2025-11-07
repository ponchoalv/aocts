#!/usr/bin/env node

// Script to get last run parameters for VS Code debugging
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, 'last-run.env');

if (fs.existsSync(envFile)) {
  const content = fs.readFileSync(envFile, 'utf8');
  const lines = content.trim().split('\n');
  
  let year = '2024';
  let day = '1';
  
  for (const line of lines) {
    if (line.startsWith('LAST_YEAR=')) {
      year = line.split('=')[1];
    }
    if (line.startsWith('LAST_DAY=')) {
      day = line.split('=')[1];
    }
  }
  
  if (process.argv[2] === 'year') {
    console.log(year);
  } else if (process.argv[2] === 'day') {
    console.log(day);
  }
} else {
  // Default values if no last run
  if (process.argv[2] === 'year') {
    console.log('2024');
  } else if (process.argv[2] === 'day') {
    console.log('1');
  }
}