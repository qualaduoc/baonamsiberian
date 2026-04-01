const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
   const [key, ...vals] = line.split('=');
   if(key && vals.length > 0) env[key.trim()] = vals.join('=').trim();
});
console.log(Object.keys(env));
