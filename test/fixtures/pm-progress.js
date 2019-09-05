#!/usr/bin/env node

process.on('SIGUSR1', function() {
  console.log('SIGUSR1');
  process.exit();
});

process.on('SIGUSR2', function() {
  console.log('SIGUSR2');
  process.exit();
});

process.on('SIGTERM', function() {
  console.log('SIGTERM');
  process.exit();
});

process.on('SIGINT', function() {
  console.log('SIGINT');
  process.exit();
});

process.on('SIGHUP', function() {
  console.log('SIGHUP');
  process.exit();
});

setInterval(function() {
  process.stdout.write('.');
}, 100); // Mimic a running process
