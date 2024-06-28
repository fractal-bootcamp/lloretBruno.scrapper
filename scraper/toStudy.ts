import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

// Function to fetch HTML content from a URL
export const fetchHTML = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('text/html')) {
            return await response.text();
        } else if (contentType && contentType.includes('application/json')) {
            return JSON.stringify(await response.json());
        } else {
            throw new Error('Unsupported content type');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return '';
    }
};

// Function to extract anchor tags and their href attributes from HTML content
export const getAnchorTags = (html: string): string[] => {
    const $ = cheerio.load(html);
    const links: string[] = [];
    $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
            links.push(href);
        }
    });
    return links;
};

// Function to create output directory and save the scraped data
const makeOutputDirectory = (scrapedData: string[] | undefined, depth: number, parentDir: string) => {
    const dirPath = path.join(parentDir, `depth_${depth}`);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Create file
    const filePath = path.join(dirPath, 'scrapedFile.html');
    const fileData = scrapedData?.join('\n') || 'links were not found';
    fs.writeFile(filePath, fileData, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('File written successfully\n');
        }
    });

    return dirPath; // Return the directory path for further use
};

// Recursive function to scrape a site up to a specified depth
async function scrapeSite(url: string, depth: number, parentDir: string, visitedUrls: Set<string>, linkVolume: number): Promise<string[]> {
    if (depth === 0 || visitedUrls.has(url)) {
        return [];
    }

    visitedUrls.add(url);

    console.log(`Scraping URL: ${url} at depth: ${depth}...`);

    const rawHTML = await fetchHTML(url);

    if (!rawHTML) {
        console.log('Failed to fetch HTML');
        return [];
    }

    const anchorTags = getAnchorTags(rawHTML).slice(0, linkVolume); // Limit to the volume of links we defined input

    const currentDir = makeOutputDirectory(anchorTags, depth, parentDir);

    let allLinks: string[] = [...anchorTags];

    for (const link of anchorTags) {
        // Handle relative URLs by converting them to absolute URLs
        let absoluteLink = link;
        if (link.startsWith('/')) {
            const urlObj = new URL(url);
            absoluteLink = `${urlObj.protocol}//${urlObj.host}${link}`;
        }

        if (absoluteLink.startsWith('http')) {
            const childLinks = await scrapeSite(absoluteLink, depth - 1, currentDir, visitedUrls, linkVolume);
            allLinks = [...allLinks, ...childLinks];
        }
    }

    return allLinks;
}

// Example usage
(async () => {
    const startUrl = 'https://nodejs.org/api/fs.html#filehandlesync';
    const startDepth = 3;
    const outputDir = './scraped';
    const visitedUrls = new Set<string>();
    const linkVolume = 20;

    const scrapedData = await scrapeSite(startUrl, startDepth, outputDir, visitedUrls, linkVolume);
    console.log(scrapedData);
})();
