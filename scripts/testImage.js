const { scrapeSiberianAction } = require('../src/app/actions/scraperAction.ts');
const fetch = require('node-fetch');

async function test() {
  const url = 'https://www.herbalife.com/vi-vn/u/products/protein-drink-mix-cookies-and-cream-550g-0146';
  
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  console.log('HTML Length:', html.length);
  
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  let finalImageUrl = '';
  
  const nextDataNode = $('#__NEXT_DATA__').html();
  if (nextDataNode) {
    console.log('Found NEXT_DATA');
    try {
      const nextData = JSON.parse(nextDataNode);
      const pd = nextData?.props?.pageProps?.productDetails?.productData;
      if (pd) {
        console.log('Found PD properties');
        console.log('defaultImage._publishUrl:', pd.defaultImage?._publishUrl);
        console.log('imageGallery:', pd.imageGallery?.map(i => i?._publishUrl));
        finalImageUrl = pd.defaultImage?._publishUrl || '';
      }
    } catch (e) {
      console.log('JSON Parse Erro:', e.message);
    }
  } else {
    console.log('No NEXT_DATA');
  }
  
  if (!finalImageUrl) finalImageUrl = $('meta[property="og:image"]').attr('content') || '';
  console.log('OG Image:', $('meta[property="og:image"]').attr('content'));
  console.log('Final Image URL:', finalImageUrl);
}

test();
