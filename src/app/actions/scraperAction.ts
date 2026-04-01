"use server";

import * as cheerio from 'cheerio';

export async function scrapeSiberianAction(url: string) {
  try {
    if (!url || (!url.includes('siberianhealth.com') && !url.includes('amway.com.vn') && !url.includes('herbalife.com'))) {
      return { error: 'Link không hợp lệ! Vui lòng nhập link sản phẩm từ Siberian Health, Amway hoặc Herbalife.' };
    }

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      next: { revalidate: 0 } // No cache for scraping
    });

    if (!res.ok) {
      if (res.status === 403) return { error: `Bị chặn bởi bảo mật (Error 403). Web gốc nghi ngờ server dùng bot cào.`};
      return { error: `Lỗi kết nối Server gốc: ${res.status}` };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Bóc tách tuỳ theo domain
    let finalTitle = '';
    let finalPrice = 0;
    let finalImageUrl = '';
    let finalDescription = '';

    if (url.includes('herbalife.com')) {
      const nextDataNode = $('#__NEXT_DATA__').html();
      if (nextDataNode) {
        try {
          const nextData = JSON.parse(nextDataNode);
          const pd = nextData?.props?.pageProps?.productDetails?.productData;
          if (pd) {
            finalTitle = pd.variant?.productName || pd.name?.['vi-VN'] || pd.name || '';
            finalImageUrl = pd.defaultImage?._publishUrl 
                         || pd.imageGallery?.[0]?._publishUrl 
                         || pd.image?._publishUrl 
                         || pd.variant?.image?._publishUrl 
                         || pd.overviewImage?._publishUrl 
                         || '';
            if (pd.productTabs && pd.productTabs.length > 0) {
               let rawDesc = pd.productTabs[0]?.description?.html || '';
               rawDesc = rawDesc.replace(/<[^>]*>?/gm, '\n'); // Remove HTML
               finalDescription = rawDesc.replace(/\n\s*\n/g, '\n').trim();
            }
          }
        } catch (e) {
          console.error("Herbalife JSON parse err", e);
        }
      }
      if (!finalTitle) finalTitle = $('meta[property="og:title"]').attr('content') || $('title').text();
      if (!finalImageUrl) finalImageUrl = $('meta[property="og:image"]').attr('content') || '';
      
      // Quét thủ công link ảnh Herbalife trong toàn bộ mã HTML phòng trường hợp cấu trúc thay đổi (Fallback Regex)
      if (!finalImageUrl) {
        const fallbackImg = html.match(/(?:"|')([^"']*(?:market-reusable-assets|images\/canister|assets)[^"']*\.(?:png|jpe?g|webp)[^"']*)(?:"|')/i);
        if (fallbackImg) {
          finalImageUrl = fallbackImg[1];
        }
      }
      if (!finalDescription) finalDescription = $('meta[name="description"]').attr('content') || '';
      
      // Lấy title sạch cho herbalife (bỏ bớt suffix)
      finalTitle = finalTitle.replace(/\|.*/, '').trim();

    } else if (url.includes('amway.com.vn')) {
      finalTitle = $('meta[property="og:title"]').attr('content') || $('title').text();
      finalImageUrl = $('meta[property="og:image"]').attr('content') || '';
      finalDescription = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
      
      // Loại bỏ - Mua trực tuyến hoặc các hậu tố tương tự
      finalTitle = finalTitle.replace(/\|.*/, '').trim();
      
    } else {
      // SIBERIAN HEALTH (Logic cũ)
      let title = $('h1').first().text().trim() || $('.b-product__title').text().trim();
      if (!title) {
        title = $('title').text().replace(' - Mua trên trang web chính thức của Siberian Wellness', '').trim();
      }
      
      let priceMeta = $('meta[property="product:price:amount"]').attr('content');
      let priceText = priceMeta 
        || $('.b-product-price__regular').text().trim() 
        || $('.price').first().text().trim() 
        || $('.b-price').first().text().trim();
        
      priceText = priceText.replace(/\D/g, ''); 
      finalPrice = priceText ? parseInt(priceText, 10) : 0;

      let imageUrl = $('meta[property="og:image"]').attr('content') 
        || $('.b-product-image__img').attr('src') || $('img.product-image').attr('src');
      
      if (imageUrl && !imageUrl.startsWith('http')) {
        if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
        else imageUrl = 'https://vn.siberianhealth.com' + imageUrl;
      }
      finalImageUrl = imageUrl || '';

      let description = '';
      const possibleSelectors = [
        '#product-about', '.product-about', '.b-product-details__tab-content',
        '#detail-tab', '.product-info', '.b-product__details form',
        '.tab-content', '.tab-pane.active', '.b-product-description'
      ];
      for (const selector of possibleSelectors) {
        const text = $(selector).text().trim().replace(/\s+/g, ' ');
        if (text.length > description.length) description = text;
      }

      if (description.length < 50) {
        const $miengTaHeading = $('h2, h3, h4').filter(function() { return $(this).text().trim().toLowerCase().includes('miêu tả'); });
        if ($miengTaHeading.length > 0) description = $miengTaHeading.parent().text().trim().replace(/\s+/g, ' ');
      }
      if (description.length < 50) description = $('meta[name="description"]').attr('content') || '';
      
      finalTitle = title;
      finalDescription = description;
    }

    // Xử lý chunk chung
    if (finalDescription.length > 2500) {
      finalDescription = finalDescription.substring(0, 2500) + '...';
    }

    // Tối ưu Hình ảnh chung
    if (finalImageUrl) {
      // Bổ sung domain nếu hình ảnh là link tương đối (Của herbalife, amway, siberian)
      if (!finalImageUrl.startsWith('http')) {
        if (finalImageUrl.startsWith('//')) {
          finalImageUrl = 'https:' + finalImageUrl;
        } else {
          try {
            const domainObj = new URL(url);
            finalImageUrl = domainObj.origin + (finalImageUrl.startsWith('/') ? '' : '/') + finalImageUrl;
          } catch (e) {
            console.error("Lỗi parse URL domain", e);
          }
        }
      }
      
      // Tối ưu link hình ảnh (Loại bỏ các parameter thừa như size ảnh, đuôi .png:pdp... hay .jpg?...)
      finalImageUrl = finalImageUrl.replace(/(\.(png|jpe?g|gif|webp))[:?].*$/i, '$1');
    }

    if (!finalTitle) {
        return { error: 'Lấy dữ liệu thất bại, có thể Website đã đổi cấu trúc code, chức năng bóc tách không hiểu.' };
    }

    return {
      success: true,
      data: {
        name: finalTitle,
        price: finalPrice,
        image_url: finalImageUrl || '',
        short_description: finalDescription,
      }
    };
  } catch (err: any) {
    return { error: err.message || 'Lỗi không xác định khi Scraping' };
  }
}
