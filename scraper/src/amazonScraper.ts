import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeAmazon(searchTerm: string) {
    // NOTE: Amazon blocks scraping; this is a placeholder for demonstration.
    // In production, use APIs or legal data sources.
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`;
    const headers = { 'User-Agent': 'Mozilla/5.0' };
    try {
        const { data } = await axios.get(url, { headers, timeout: 10000 });
        const $ = cheerio.load(data);
        const results: { name: string; cost: string; url: string; website: string}[] = [];

        $('.s-result-item').each((_, el) => {
            const name = $(el).find('h2 a span').text().trim();
            const cost = $(el).find('.a-price .a-offscreen').first().text().trim();
            const url = 'https://www.amazon.com' + $(el).find('h2 a').attr('href');
            const website = 'amazon';
            if (name && cost && url) {
                results.push({ name, cost, url, website });
            }
        });

        return results;
    } catch (err: any) {
        if (err.response && err.response.status === 503) {
            console.error('Amazon returned 503 - likely blocked');
        } else {
            console.error('Amazon scrape error:', err);
        }
        return [];
    }
}