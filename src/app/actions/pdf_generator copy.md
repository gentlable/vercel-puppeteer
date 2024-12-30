'use server';

import puppeteer from 'puppeteer';

export async function generatePDF() {
  // Puppeteerの起動
  const browser = await puppeteer.launch({ headless: true });
  // 新しいページを開く
  const page = await browser.newPage();

  // 日本語の簡単なHTMLコンテンツ
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <title>サンプルPDF</title>
    </head>
    <body>
      <h1>こんにちは、世界！</h1>
      <p>これはサンプルPDFです。</p>
    </body>
    </html>
  `;

  // HTMLコンテンツをページに設定
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // PDFを生成
  const pdf = await page.pdf({
    format: 'A4',
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 10px; margin-left: 30px;">サンプルヘッダー</div>',
    footerTemplate: '<div style="font-size: 10px; margin-left: 30px;">ページ <span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    margin: {
      top: '100px',
      bottom: '100px',
      left: '30px',
      right: '30px'
    }
  });

  // Uint8ArrayをBufferに変換
  const buffer = Buffer.from(pdf);

  // BufferをBase64エンコード
  const base64Data = buffer.toString('base64');

  // ブラウザを閉じる
  await browser.close();  

  // PDFデータをBase64エンコードして返す
  return base64Data;
} 