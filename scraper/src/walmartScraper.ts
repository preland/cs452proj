import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWalmart(searchTerm: string) {
    const url = `https://www.walmart.com/search/?query=${encodeURIComponent(searchTerm)}`;
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
    };
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
        if (err.response && err.response.status === 412) {
            console.error('Walmart returned 412 - bot protection triggered');
        } else {
            console.error('Walmart scrape error:', err);
        }
        return [];
    }
}