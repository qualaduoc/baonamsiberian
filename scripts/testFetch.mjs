import * as cheerio from 'cheerio';
fetch('https://vn.siberianhealth.com/vn/shop/catalog/product/500526/').then(r=>r.text()).then(html => {
  const $ = cheerio.load(html);
  let c='', v='';
  $('span, div, dt, dd, th, td').each((i, el)=>{ 
    const text = $(el).text().trim(); 
    if(text === 'Mã' && !c) c = $(el).next().text().trim(); 
    if(text === 'Quy cách đóng gói' && !v) v = $(el).next().text().trim(); 
  }); 
  console.log('CODE:', c, 'VARIANT:', v);
})
