import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWalmart(searchTerm: string) {
    const url = `https://www.walmart.com/search/?query=${encodeURIComponent(searchTerm)}`;
    const headers = { 'User-Agent': 'Mozilla/5.0' };
    try {
        const { data } = await axios.get(url, { headers, timeout: 10000 });
        const $ = cheerio.load(data);
        const results: { name: string; cost: string; url: string; website: string }[] = [];

        $('[data-item-id]').each((_, el) => {
            const name = $(el).find('a[data-type="itemTitles"]').text().trim();
            const cost = $(el).find('span[data-automation-id="product-price"]').first().text().trim();
            const urlPath = $(el).find('a[data-type="itemTitles"]').attr('href');
            const url = urlPath ? `https://www.walmart.com${urlPath}` : '';
            const website = 'walmart';
            if (name && cost && url) {
                results.push({ name, cost, url, website });
            }
        });

        return results;
    } catch (err: any) {
        console.error('Walmart scrape error:', err);
        return [];
    }
}