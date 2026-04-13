export default async function handler(req, res) {
  // Allow GET only
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Build the Polymarket Gamma API URL from query params
  const params = new URLSearchParams(req.query);
  const endpoint = params.get('endpoint') || 'events';
  params.delete('endpoint');

  const url = `https://gamma-api.polymarket.com/${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Polymarket API returned ${response.status}` });
    }

    const data = await response.json();

    // Cache for 60 seconds to avoid rate limiting
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch from Polymarket API' });
  }
}
