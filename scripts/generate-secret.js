import crypto from 'crypto';
const secretKey = crypto.randomBytes(32).toString('base64');

console.log('Generated NEXTAUTH_SECRET:');
console.log(secretKey);
console.log('\nCopy this value to your .env file for NEXTAUTH_SECRET');