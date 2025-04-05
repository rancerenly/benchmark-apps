import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import { URL } from 'url';

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

        return [
            { framework, test: 'Performance Score', averageTime: Math.round(lhr.categories.performance.score * 100), environment: 'Lighthouse' },
            { framework, test: 'First Contentful Paint (FCP)', averageTime: Math.round(lhr.audits['first-contentful-paint'].numericValue), environment: 'Lighthouse' },
            { framework, test: 'Largest Contentful Paint (LCP)', averageTime: Math.round(lhr.audits['largest-contentful-paint'].numericValue), environment: 'Lighthouse' },
            { framework, test: 'Total Blocking Time (TBT)', averageTime: Math.round(lhr.audits['total-blocking-time'].numericValue), environment: 'Lighthouse' },
            { framework, test: 'Cumulative Layout Shift (CLS)', averageTime: lhr.audits['cumulative-layout-shift'].numericValue.toFixed(2), environment: 'Lighthouse' },
            { framework, test: 'Speed Index', averageTime: Math.round(lhr.audits['speed-index'].numericValue), environment: 'Lighthouse' },
            { framework, test: 'Time to Interactive (TTI)', averageTime: Math.round(lhr.audits['interactive'].numericValue), environment: 'Lighthouse' },
        ];
    } catch (e) {
        console.error('Lighthouse error:', e);
        return [];
    } finally {
        await browser.close();
    }
}
