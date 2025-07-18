const axios = require('axios');
require('dotenv').config();


const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

async function summarizeWithClaude(content) {
    try {
        const prompt = `
            You will be given a text content. Extract a concise summary, title, and 5–10 keywords. 
            Respond strictly in the following JSON format:

            {
            "title": "string",
            "summary": "string",
            "keywords": ["keyword1", "keyword2", ...]
            }
            Content:
            ${content}
        `;

        const response = await axios.post(CLAUDE_API_URL, {
            model: 'claude-3-opus-20240229',
            max_tokens: 1000,
            messages: [{ role: 'user', content: prompt }],
        }, {
            headers: {
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            }
        });

        const aiResponse = response.data?.content?.[0]?.text || '';
        return { data: aiResponse }


    } catch (error) {
        console.error('Claude API error:', error.message);
        throw new Error('Failed to summarize content');
    }
}

module.exports = { summarizeWithClaude };
