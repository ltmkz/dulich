const fs = require('fs');
const html = fs.readFileSync('i25jt5hv.html', 'utf8');
const match = html.match(/<script type="application\/json" id="__NUXT_DATA__" data-ssr="false">(.*?)<\/script>/);
if (match) {
  fs.writeFileSync('nuxt-data.json', JSON.stringify(JSON.parse(match[1]), null, 2));
  console.log('Saved nuxt-data.json');
} else {
  console.log('Not found');
}
