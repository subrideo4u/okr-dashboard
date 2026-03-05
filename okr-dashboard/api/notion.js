export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const NOTION_TOKEN = 'ntn_K26285093941F6mgS1IHloKUiKGFEJgxi6WMOCCCpIz3N2';

  try {
    const { endpoint, body } = req.body || {};
    if (!endpoint) {
      return res.status(400).json({ error: 'endpoint is required' });
    }

    const options = {
      method: body ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`https://api.notion.com/v1${endpoint}`, options);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}