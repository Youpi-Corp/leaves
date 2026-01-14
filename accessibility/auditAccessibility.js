import fs from 'node:fs/promises';
import puppeteer from 'puppeteer';
import axeCore from 'axe-core';

const DEFAULT_PAGES = [
  'https://brain-forest.works/',
  'https://brain-forest.works/library',
  'https://brain-forest.works/login',
  'https://brain-forest.works/create'
];

const SITEMAP_URL = 'https://brain-forest.works/sitemap.xml';

async function getTargetPages() {
  try {
    const response = await fetch(SITEMAP_URL, { redirect: 'follow' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
    const uniqueUrls = Array.from(new Set(locs));

    if (uniqueUrls.length === 0) {
      throw new Error('No <loc> entries found in sitemap');
    }

    console.log(`Loaded ${uniqueUrls.length} page(s) from sitemap.`);
    return uniqueUrls;
  } catch (error) {
    console.warn(`Unable to load sitemap (${error.message}); falling back to default pages.`);
    return DEFAULT_PAGES;
  }
}

async function auditPages() {
  let browser;
  const results = [];

  try {
    const pagesToAudit = await getTargetPages();
    browser = await puppeteer.launch({ headless: true });

    const impactTotals = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0,
      unknown: 0
    };
    let violationTotal = 0;

    for (const url of pagesToAudit) {
      const page = await browser.newPage();
      console.log(`\nAuditing ${url}...`);

      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
        await page.addScriptTag({ content: axeCore.source });

        const { violations } = await page.evaluate(async () => {
          return await axe.run();
        });

        results.push({ url, violations });
        console.log(`Found ${violations.length} violation(s)`);

        if (violations.length === 0) {
          console.log('No violations detected by axe-core.');
        } else {
          violations.forEach((violation) => {
            console.log(`- ${violation.id} (${violation.impact || 'impact not provided'})`);

            violationTotal += 1;
            const impactKey = violation.impact || 'unknown';
            if (impactTotals[impactKey] !== undefined) {
              impactTotals[impactKey] += 1;
            } else {
              impactTotals.unknown += 1;
            }
          });
        }
      } catch (pageError) {
        console.error(`Error while auditing ${url}: ${pageError.message}`);
        results.push({ url, violations: [] });
      } finally {
        await page.close().catch(() => {});
      }
    }

    const outputPath = new URL('./reports/accessibility-report.json', import.meta.url);
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2), 'utf8');
    console.log('\nDetailed results saved to accessibility/reports/accessibility-report.json');

    console.log('\nSummary across all pages:');
    console.log(`Total violations: ${violationTotal}`);
    console.log(
      `By impact -> critical: ${impactTotals.critical}, serious: ${impactTotals.serious}, moderate: ${impactTotals.moderate}, minor: ${impactTotals.minor}, unknown: ${impactTotals.unknown}`
    );
  } catch (error) {
    console.error('Accessibility audit failed:', error);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

auditPages();
