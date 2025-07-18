const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { summarizeWithClaude } = require('./calude');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: ['http://localhost:3000', 'https://webscrapper-3of5ac4v0-surya-9d3517eb.vercel.app/'],
}));
app.use(express.json());

app.post('/scrape', async (req, res) => {
    const targetUrl = req.body.url;

    if (!targetUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Allow only http/https URLs
    if (!/^https?:\/\/.+/i.test(targetUrl)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        const { data: html } = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            },
            timeout: 10000
        });

        const $ = cheerio.load(html);
        const title = $('title').text() || $('h1').first().text();
        let content = '';

        // Try to extract readable content from common selectors
        const selectors = ['article', 'main', '.post-content', '.article-body', 'body'];
        for (const sel of selectors) {
            const text = $(sel).text();
            if (text.length > 200) {
                content = text;
                break;
            }
        }

        if (!content || content.length < 200) {
            return res.status(404).json({ error: 'Content too short or not found' });
        }

        // Send to Claude (your custom function)
        const { data } = await summarizeWithClaude(content);
        let parsedData = JSON.parse(data);
        res.json({
            url: targetUrl,
            title: parsedData.title,
            summary: parsedData.summary,
            keywords: parsedData.keywords
        });

    } catch (err) {
        console.error('Scraping failed:', err.message);
        if (err.code === 'ECONNABORTED') {
            return res.status(504).json({ error: 'Request to target site timed out' });
        }
        if (err.response && err.response.status === 403) {
            return res.status(403).json({ error: 'Access forbidden by target site' });
        }
        res.status(500).json({ error: 'Failed to extract content' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
