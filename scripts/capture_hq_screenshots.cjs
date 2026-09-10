const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,1000']
  });

  const page = await browser.newPage();
  // 1440x900 at 2x DPR gives crisp 2880x1800 Retina images
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const outDir = path.resolve(__dirname, '../public/screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('1. Capturing Home...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '01_home.png') });

  console.log('2. Capturing AI Diagnosis...');
  await page.goto('http://localhost:5173/ai-assistant', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '02_ai_diagnosis.png') });

  // Click an appliance to show questionnaire
  try {
    const cards = await page.$$('button, div[role="button"]');
    for (const c of cards) {
      const text = await page.evaluate(el => el.textContent, c);
      if (text && (text.includes('Smart AC') || text.includes('Geyser') || text.includes('Water Purifier'))) {
        await c.click();
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: path.join(outDir, '09_ai_questions.png') });
        break;
      }
    }
  } catch(e) {
    console.log('Appliance click note:', e.message);
  }

  console.log('3. Capturing Services Catalog...');
  await page.goto('http://localhost:5173/services', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '03_services.png') });

  console.log('4. Capturing Technicians...');
  await page.goto('http://localhost:5173/technicians', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(outDir, '04_technicians.png') });

  console.log('5. Capturing Login...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, '05_login.png') });

  console.log('6. Capturing Customer Dashboard...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Customer (Rahul)'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, '07_customer_dashboard.png') });

  console.log('7. Capturing Technician Dashboard...');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Technician (Rajesh)'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, '08_technician_dashboard.png') });

  console.log('8. Capturing Admin Dashboard...');
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(x => x.textContent.includes('Admin (Madhuri)'));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(outDir, '06_admin_dashboard.png') });

  // Sync to docs/screenshots as well
  const docsDir = path.resolve(__dirname, '../docs/screenshots');
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(outDir);
    for (const f of files) {
      if (f.endsWith('.png')) {
        fs.copyFileSync(path.join(outDir, f), path.join(docsDir, f));
      }
    }
  }

  await browser.close();
  console.log('All HQ 2x screenshots captured cleanly!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
