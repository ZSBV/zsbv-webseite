const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1600 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Wait a moment for any fade-in animations
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: 'trust_bar_screenshot.png', fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 1200 } });

    await browser.close();
    console.log('Screenshot saved as trust_bar_screenshot.png');
})();
