'use server';

import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function generatePDF() {
  const isLambda = process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.VERCEL;

  let browser = null;
    
  try {
        
    if (isLambda) {
        // Lambda/Vercel環境
        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,    
        });
    } else {
        // ローカル環境
        process.env.CHROMIUM_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        
        browser = await puppeteer.launch({
            args: [...chromium.args, '--lang=ja', '--font-render-hinting=none', '--force-color-profile=srgb'],
            defaultViewport: chromium.defaultViewport,
            executablePath: process.env.CHROMIUM_PATH,
            headless: chromium.headless,
            
        });
    }

      const page = await browser.newPage();
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'ja-JP'
      });
      
      
      const html = `
          <html lang="ja" >
              <style>
                @font-face {
                    font-family: 'IPAexGothic';
                    src: url('https://cdn.jsdelivr.net/npm/@cjpatoilo/ipaexgothic-fonts@latest/fonts/ipaexg.ttf') format('truetype');
                }
                body {
                    font-family: 'IPAexGothic', sans-serif;
                }
            </style>
              <body>
                  <h1>テストページ1</h1>
                  <p>これはAWS Lambda用の設定でテスト実行しています。</p>
              </body>
          </html>
      `;
      
      await page.setContent(html);
      const pdf = await page.pdf({
          format: 'a4',
          printBackground: true
      });

      // PDF (Buffer) を Uint8Array に変換
      const uint8Array = new Uint8Array(pdf);

      // Uint8Array を Base64 エンコードして返す
      return Buffer.from(uint8Array).toString('base64');
      
  } catch (error) {
      console.error('エラー:', error);
      return ''; // エラー時は空文字列を返す
  } finally {
      if (browser !== null) {
          await browser.close();
      }
  }
} 