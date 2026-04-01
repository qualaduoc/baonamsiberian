import { scrapeSiberianAction } from '../src/app/actions/scraperAction';

async function test() {
  const url = 'https://www.herbalife.com/vi-vn/u/products/protein-drink-mix-cookies-and-cream-550g-0146';
  const data = await scrapeSiberianAction(url);
  console.log(JSON.stringify(data, null, 2));
}

test();
