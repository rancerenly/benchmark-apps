import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { URL } from 'url';

export function extractLighthouseMetrics(lhr) {
    return {
        performanceScore: lhr.categories.performance.score * 100,

        firstContentfulPaint: lhr.audits['first-contentful-paint']?.numericValue,
        largestContentfulPaint: lhr.audits['largest-contentful-paint']?.numericValue,
        speedIndex: lhr.audits['speed-index']?.numericValue,

        timeToInteractive: lhr.audits['interactive']?.numericValue,
        maxPotentialFID: lhr.audits['max-potential-fid']?.numericValue,

        bootupTime: lhr.audits['bootup-time']?.numericValue,
        mainThreadWork: lhr.audits['mainthread-work-breakdown']?.numericValue,

    };
}

export async function runLighthouseBenchmark(url, framework = "Unknown", options = { headless: false }) {
    console.log(`Running Lighthouse benchmark for ${framework} at ${url}`);

    const browser = await puppeteer.launch({
        headless: options.headless,
        args: ['--remote-debugging-port=9222', '--no-sandbox', '--window-size=1920,1080'    ]
    });


    try {
        const { lhr } = await lighthouse(url, {
            port: new URL(browser.wsEndpoint()).port,
            output: 'json',
            throttlingMethod: 'provided',
            preset: 'desktop',
            onlyCategories: ['performance'],
            screenEmulation: {
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1,
                disabled: false
            }
        });

        return extractLighthouseMetrics(lhr);
    } catch (e) {
        console.error('Lighthouse error:', e);
        return [];
    } finally {
        await browser.close();
    }
}
