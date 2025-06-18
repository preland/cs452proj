import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeAliExpress(searchTerm: string) {
    const url = `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(searchTerm)}`;
    const headers = { 'User-Agent': 'Mozilla/5.0' };
    try {
        const { data } = await axios.get(url, { headers, timeout: 10000 });
        const $ = cheerio.load(data);
        const results: { name: string; cost: string; url: string; website: string }[] = [];

        // Log how many elements match your selector
        const items = $('a._3t7zg');
        console.log(`AliExpress: found ${items.length} items for selector 'a._3t7zg'`);

        items.each((_, el) => {
            const name = $(el).find('h1._18_85').text().trim() || $(el).find('h1').text().trim();
            const cost = $(el).find('div.mGXnE._37W_B span').first().text().trim();
            const url = 'https:' + ($(el).attr('href') || '');
            const website = 'aliexpress';
            if (name && cost && url) {
                results.push({ name, cost, url, website });
            }
        });

        // If no results, log a warning
        if (results.length === 0) {
            console.warn('AliExpress: No products found. The page structure may have changed.');
        }

        return results;
    } catch (err: any) {
        console.error('AliExpress scrape error:', err);
        return [];
    }
}