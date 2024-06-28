#!/usr/bin/env node
import { scrapeSite } from './script'; // Assuming that the file 'scraper.ts' exists in the same directory as 'index.ts'
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Argv {
    _: (string | number)[];
    depth: number;
    "per-page": number;
    $0: string;
}

const argv = yargs(hideBin(process.argv))
    .option('depth', {
        alias: 'd',
        type: 'number',
        description: 'Depth of scraping',
        default: 1
    })
    .option('per-page', {
        alias: 'p',
        type: 'number',
        description: 'Number of items per page',
        default: 10
    })
    .demandCommand(1, 'You need to provide a URL to scrape')
    .argv as unknown as Argv;

const { _: [url], depth, "per-page": linkVolume } = argv;

console.log(`Scraping URL: ${url} with depth: ${depth} and per-page: ${linkVolume}`);

// Step 5: Integrate Your Scraper
async function runScraper() {
    try {
        const visitedUrls = new Set<string>();
        const result = await scrapeSite(url as string, depth, 'scrapped', visitedUrls, linkVolume);
        console.log('Scraping result:', result);
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}

runScraper();
