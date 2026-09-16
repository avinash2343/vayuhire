import { chromium } from 'playwright';
import * as cheerio from 'cheerio';

export const scrapeCareerPage = async (url) => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const html = await page.content();
    
    return html;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    throw new Error(`Scraping failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export const cleanHtml = (html) => {
  const $ = cheerio.load(html);
  
  // Remove unnecessary tags
  $('script, style, nav, footer, header, noscript, iframe, svg').remove();
  
  // Extract text
  let text = $('body').text();
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Truncate to 50000 chars to avoid token limits
  if (text.length > 50000) {
    text = text.substring(0, 50000);
  }
  
  return text;
};
