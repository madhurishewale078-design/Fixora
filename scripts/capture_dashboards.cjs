const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function captureDashboards() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  const outDir = path.resolve(__dirname, '../public/screenshots');

  // 1. Customer
  console.log('Logging in as Customer...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.trim().includes('Customer'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outDir, '07_customer_dashboard.png') });
  console.log('Customer Dashboard saved!');

  // 2. Technician
  console.log('Logging in as Technician...');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Tech (Rajesh)'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outDir, '08_technician_dashboard.png') });
  console.log('Technician Dashboard saved!');

  // 3. Admin
  console.log('Logging in as Admin...');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Admin Login'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.screenshot({ path: path.join(outDir, '06_admin_dashboard.png') });
  console.log('Admin Dashboard saved!');

  await browser.close();
}

captureDashboards().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
