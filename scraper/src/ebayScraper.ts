import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeEbay(searchTerm: string) {
    const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(searchTerm)}`;
    const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });
    const $ = cheerio.load(data);
    const results: { name: string; cost: string; url: string; website: string }[] = [];

    $('.s-item').each((_, el) => {
        const name = $(el).find('.s-item__title').text().trim();
        const cost = $(el).find('.s-item__price').text().trim();
        const url = $(el).find('.s-item__link').attr('href');
        const website = 'ebay';
        // Filter out invalid or placeholder items
        if (
            name &&
            name.toLowerCase() !== 'shop on ebay' &&
            cost &&
            url &&
            url.startsWith('http')
        ) {
            results.push({ name, cost, url, website });
        }
    });

    return results;
}