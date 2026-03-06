export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Notion-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const NOTION_TOKEN = 'ntn_K26285093941F6mgS1IHloKUiKGFEJgxi6WMOCCCpIz3N2';

    try {
        let requestBody = req.body;
        
        if (typeof requestBody === 'string') {
            try {
                requestBody = JSON.parse(requestBody);
            } catch (e) {
                return res.status(400).json({ error: 'Invalid JSON body' });
            }
        }

        const endpoint = requestBody?.endpoint;
        const body = requestBody?.body;

        if (!endpoint) {
            return res.status(400).json({ error: 'endpoint is required' });
        }

        const notionUrl = `https://api.notion.com/v1${endpoint}`;
        
        const fetchOptions = {
            method: body ? 'POST' : 'GET',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(notionUrl, fetchOptions);
        const data = await response.json();

        res.status(response.status).json(data);

    } catch (error) {
        console.error('Notion API proxy error:', error);
        res.status(500).json({ error: error.message });
    }
}
