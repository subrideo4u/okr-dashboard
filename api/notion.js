export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Notion API Proxy is running' });
  }

  const NOTION_TOKEN = 'ntn_K26285093941F6mgS1IHloKUiKGFEJgxi6WMOCCCpIz3N2';

  try {
    const body = req.body;
    const { endpoint, body: notionBody } = body || {};

    if (!endpoint) {
      return res.status(400).json({ error: 'endpoint is required' });
    }

    const options = {
      method: notionBody ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    };

    if (notionBody) {
      options.body = JSON.stringify(notionBody);
    }

    const response = await fetch(`https://api.notion.com/v1${endpoint}`, options);
    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}
