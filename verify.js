export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false, error: 'Method not allowed' });
  }

  const { code, city } = req.body;

  if (!code || !city) {
    return res.status(400).json({ valid: false, error: 'Missing code or city' });
  }

  const STATIC_CODES = {
    valencia: 'VALENCIA2026',
    seville:  'SEVILLE2026',
    brussels: 'BRUSSELS2026',
    lisbon:   'LISBON2026',
    london:   'LONDON2026',
    paris:    'PARIS2026',
    amsterdam:'AMSTERDAM2026',
    berlin:   'BERLIN2026',
    barcelona:'BARCELONA2026',
    cadiz:    'CADIZ2026',
    bordeaux: 'BORDEAUX2026'
  };

  // Check static code first
  if (STATIC_CODES[city.toLowerCase()] === code.toUpperCase().trim()) {
    return res.status(200).json({ valid: true, source: 'static' });
  }

  // Check Lemon Squeezy license key
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ valid: false, error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        license_key: code.trim(),
        instance_name: 'Stepcast-' + city
      })
    });

    const data = await response.json();

    if (data.activated || data.valid) {
      return res.status(200).json({ valid: true, source: 'lemonsqueezy' });
    } else {
      return res.status(200).json({ valid: false, error: data.error || 'Invalid code' });
    }

  } catch (err) {
    return res.status(500).json({ valid: false, error: 'Verification failed' });
  }
}
