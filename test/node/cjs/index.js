if ('Bun' in globalThis) {
  throw new Error('❌ Use Node.js to run this test!');
}

const { cors } = require('@huyooo/elysia-cors');

if (typeof cors !== 'function') {
  throw new Error('❌ CommonJS Node.js failed');
}

console.log('✅ CommonJS Node.js works!');
