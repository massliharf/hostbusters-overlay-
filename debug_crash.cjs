const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('pageerror', error => {
        console.log('CRASH CAUGHT:');
        console.log(error.message);
        console.log(error.stack);
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('CONSOLE ERROR CAUGHT:');
            console.log(msg.text());
        }
    });

    await page.goto('http://localhost:3001/hostbusters-overlay-/', { waitUntil: 'networkidle0' });
    
    // Select DUO theme (it defaults to DUO if last used local storage, but let's click it)
    try {
        const themeTabs = await page.$$('button');
        for (let btn of themeTabs) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('DUO')) {
                await btn.click();
            }
        }
    } catch(e){}

    // Click START
    const btns = await page.$$('button');
    for (let btn of btns) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text === 'START') {
            await btn.click();
            break;
        }
    }

    // Now wait for 40 seconds so the timer runs out and it triggers the "Round ending..." lose logic
    console.log("Waiting for game to run and timeout.");
    await new Promise(r => setTimeout(r, 40000));
    
    console.log("Done waiting.");
    await browser.close();
})();
