import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function test() {
  const url = 'https://www.herbalife.com/vi-vn/u/products/protein-drink-mix-cookies-and-cream-550g-0146';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const nextDataNode = $('#__NEXT_DATA__').html();
  if (nextDataNode) {
    const nextData = JSON.parse(nextDataNode);
    const pd = nextData?.props?.pageProps?.productDetails?.productData;
    console.log("PD Exists?", !!pd);
    if (pd) {
        console.log("DefaultImage:", JSON.stringify(pd.defaultImage));
        let img = pd.defaultImage?._publishUrl;
        console.log("Extract raw image:", img);
    }
  } else {
    console.log("No NEXT_DATA. og:image is", $('meta[property="og:image"]').attr('content'));
  }
}
test();
