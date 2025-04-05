import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { URL } from 'url';

export function extractLighthouseMetrics(lhr) {
    return {
        performanceScore: lhr.categories.performance.score * 100,
        firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
        totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
        cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
        speedIndex: lhr.audits['speed-index'].numericValue,
        timeToInteractive: lhr.audits['interactive'].numericValue,
    };
}


export async function runLighthouseBenchmark(url, framework = "Unknown", options = { headless: false }) {
    console.log(`Running Lighthouse benchmark for ${framework} at ${url}`);

    const browser = await puppeteer.launch({
        headless: options.headless,
        args: ['--remote-debugging-port=9222', '--no-sandbox']
    });

    try {
        const { lhr } = await lighthouse(url, {
            port: new URL(browser.wsEndpoint()).port,
            output: 'json',
            throttlingMethod: 'provided',
            preset: 'desktop',
            onlyCategories: ['performance'],
        });

        return extractLighthouseMetrics(lhr);
    } catch (e) {
        console.error('Lighthouse error:', e);
        return [];
    } finally {
        await browser.close();
    }
}
