"use server";

import * as cheerio from 'cheerio';

export async function scrapeSiberianAction(url: string) {
  try {
    if (!url || !url.includes('siberianhealth.com')) {
      return { error: 'Link không hợp lệ! Vui lòng nhập link sản phẩm từ vn.siberianhealth.com.' };
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

    // Bóc tách Tiêu đề sản phẩm
    let title = $('h1').first().text().trim() || $('.b-product__title').text().trim();
    if (!title) {
      // Fallback cho SEO title nếu không tìm thấy DOM h1 (do layout JS render)
      title = $('title').text().replace(' - Mua trên trang web chính thức của Siberian Wellness', '').trim();
    }
    
    // Bóc tách Giá bán (Siberian Health hay để class giá ở cục <strong class="price" / .b-product-price)
    // Hoặc meta property
    let priceMeta = $('meta[property="product:price:amount"]').attr('content');
    let priceText = priceMeta 
      || $('.b-product-price__regular').text().trim() 
      || $('.price').first().text().trim() 
      || $('.b-price').first().text().trim();
      
    // Trích xuất đúng số tiền (loại bỏ chữ ₫ hoặc whitespace)
    priceText = priceText.replace(/\D/g, ''); 
    const price = priceText ? parseInt(priceText, 10) : 0;

    // Bóc tách Mảng Hình ảnh (Lấy tấm đầu tiên)
    let imageUrl = $('meta[property="og:image"]').attr('content') 
      || $('.b-product-image__img').attr('src') || $('img.product-image').attr('src');
    
    if (imageUrl && !imageUrl.startsWith('http')) {
      // Bù domain nếu bị thiếu
      if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
      else imageUrl = 'https://vn.siberianhealth.com' + imageUrl;
    }

    // Bóc tách Nhanh Đoạn Mô tả dài
    let description = '';
    
    // Cố gắng tìm các class chứa thông tin chi tiết thường gặp của Siberian Health
    const possibleSelectors = [
      '#product-about',
      '.product-about', 
      '.b-product-details__tab-content',
      '#detail-tab',
      '.product-info',
      '.b-product__details form',
      '.tab-content',
      '.tab-pane.active',
      '.b-product-description'
    ];

    for (const selector of possibleSelectors) {
      const text = $(selector).text().trim().replace(/\s+/g, ' ');
      if (text.length > description.length) {
        description = text;
      }
    }

    // Nếu vẫn trống, thử tìm thẻ heading có chứa chữ 'Miêu tả' hoặc 'description'
    if (description.length < 50) {
      const $miengTaHeading = $('h2, h3, h4').filter(function() {
        return $(this).text().trim().toLowerCase().includes('miêu tả');
      });
      if ($miengTaHeading.length > 0) {
        // Lấy toàn bộ text của cha
        description = $miengTaHeading.parent().text().trim().replace(/\s+/g, ' ');
      }
    }

    // Nếu vẫn không có, dùng meta description tạm
    if (description.length < 50) {
      description = $('meta[name="description"]').attr('content') || '';
    }
      
    // Lọc bỏ bớt các khoảng trắng và \n liên tiếp, nhưng giữ lại ngắt dòng
    // Trong HTML cheerio `.text()` nó sẽ nối liền dính chữ nếu không cẩn thận,
    // ta nên map qua các thẻ p, li để nối bằng newline.

    // Format lại mô tả nếu quá dài lấy 2000 chữ (Không lấy 500 nữa vì nội dung HDSD thường dài)
    if (description.length > 2500) {
      description = description.substring(0, 2500) + '...';
    }

    // Kiểm tra tính toàn vẹn cơ bản
    if (!title) {
        return { error: 'Lấy dữ liệu thất bại, có thể Website đã đổi cấu trúc code, chức năng bóc tách không hiểu.' };
    }

    return {
      success: true,
      data: {
        name: title,
        price,
        image_url: imageUrl || '',
        short_description: description,
      }
    };
  } catch (err: any) {
    return { error: err.message || 'Lỗi không xác định khi Scraping' };
  }
}
