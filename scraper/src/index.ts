import 'dotenv/config';
import express, { Request, Response } from 'express';
import { scrapeAmazon } from './amazonScraper';
import { scrapeEbay } from './ebayScraper';
import { pool } from './db';
import type { RowDataPacket } from 'mysql2';

const app = express();
const PORT = 443; // Use 443 for HTTPS, or change to 3000 for local development

app.use(express.json());
app.use(require('cors')({
    origin: ['http://cs452.vercel.app', 'http://localhost:3000'], // add your frontend URL(s)
}));
app.get('/api/products', (req: Request, res: Response, next) => {
    (async () => {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Missing search query' });
        }

        console.log('Querying websites...');
        // 1. Get all website IDs and names
        const [websites] = await pool.query<RowDataPacket[]>(
            `SELECT id, name FROM websites`
        );
        console.log('Websites loaded:', websites.length);
        const websiteMap: Record<string, number> = {};
        for (const site of websites) {
            websiteMap[site.name.toLowerCase()] = site.id;
        }

        // 2. Check database for recent data (within 4 hours) for all websites
        console.log('Querying cached products...');
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT 
                products.name, 
                products.cost, 
                websites.name AS website, 
                products.product_url AS url
             FROM products
             JOIN websites ON products.website_id = websites.id
             WHERE products.search_term = ? 
               AND products.updated_at > (NOW() - INTERVAL 4 HOUR)`,
            [q]
        );
        console.log('Cached products loaded:', rows.length);

        if (rows.length > 0) {
            console.log('Returning cached products:');
            return res.json(rows);
        }

        // 3. Scrape new data
        console.log('Starting Amazon scrape');
        const amazonResults = await scrapeAmazon(q);
        console.log('Amazon scrape done');

        console.log('Starting eBay scrape');
        const ebayResults = await scrapeEbay(q);
        console.log('eBay scrape done');

        const allResults = [...amazonResults, ...ebayResults];
        console.log('Scraped products:', allResults);
        // 4. Save to database (upsert or insert new) using website_id
        for (const product of allResults) {
            const websiteId = websiteMap[product.website.toLowerCase()];
            if (!websiteId) continue;
            try {
                // Remove $ and , and convert to float
                const cleanCost = typeof product.cost === 'string'
                    ? parseFloat(product.cost.replace(/[^0-9.]/g, ''))
                    : product.cost;

                await pool.query(
                    `INSERT INTO products (name, search_term, cost, website_id, product_url, updated_at)
                     VALUES (?, ?, ?, ?, ?, NOW())
                     ON DUPLICATE KEY UPDATE cost = VALUES(cost), product_url = VALUES(product_url), updated_at = NOW()`,
                    [product.name, q, cleanCost, websiteId, product.url]
                );
            } catch (err) {
                console.error('Insert error:', err, product);
            }
        }

        // 5. Return results
        res.json(allResults);
    })().catch(next);
});

app.listen(PORT, () => {
    console.log(`Scraper API listening on port ${PORT}`);
});