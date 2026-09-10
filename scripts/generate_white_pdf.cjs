const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  console.log('Launching headless Chrome for White Theme PDF generation...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  console.log('Navigating to presentation_white.html...');
  await page.goto('http://localhost:5173/presentation_white.html', {
    waitUntil: 'networkidle0',
    timeout: 60000
  });

  // Wait for all images and fonts
  await page.evaluate(async () => {
    if (document.fonts) await document.fonts.ready;
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));
  });

  await new Promise(r => setTimeout(r, 1000));

  const destPaths = [
    '/Users/madhurani/Desktop/FIXORA_Presentation.pdf',
    '/Users/madhurani/Downloads/FIXORA_Presentation.pdf',
    '/Users/madhurani/Desktop/smart-home-fix/public/FIXORA_Presentation.pdf',
    '/Users/madhurani/Desktop/smart-home-fix/dist/FIXORA_Presentation.pdf',
    '/Users/madhurani/Desktop/smart-home-fix/docs/FIXORA_Presentation.pdf'
  ];

  console.log('Printing to high-resolution 16:9 PDF...');
  const pdfBuffer = await page.pdf({
    printBackground: true,
    width: '16in',
    height: '9in',
    margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' },
    preferCSSPageSize: true
  });

  for (const p of destPaths) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, pdfBuffer);
    console.log(`Saved PDF to: ${p} (${(pdfBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);
  }

  await browser.close();
  console.log('PDF Generation Complete!');
}

generatePDF().catch(err => {
  console.error('PDF Generation Failed:', err);
  process.exit(1);
});
