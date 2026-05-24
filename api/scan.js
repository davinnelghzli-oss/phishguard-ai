export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  try {
    const { prompt } = req.body;

    // Get domain from prompt for WHOIS lookup
    const urlMatch = prompt.match(/URL:\s*(\S+)/);
    let locationInfo = 'Unknown';

    if (urlMatch) {
      try {
        const rawUrl = urlMatch[1];
        const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
        const hostname = parsed.hostname;

        // Use ip-api to get location info
        const ipRes = await fetch(`http://ip-api.com/json/${hostname}?fields=status,country,countryCode,regionName,city,isp,org,hosting`);
        const ipData = await ipRes.json();

        if (ipData.status === 'success') {
          locationInfo = `${ipData.city || ''}, ${ipData.regionName || ''}, ${ipData.country || ''} (${ipData.countryCode || ''}) | ISP: ${ipData.isp || 'Unknown'} | Hosting: ${ipData.hosting ? 'Yes' : 'No'}`;
        }
      } catch(e) {
        locationInfo = 'Could not resolve location';
      }
    }

    // Add location to prompt
    const enrichedPrompt = prompt + `\n\nServer Location & ISP: ${locationInfo}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enrichedPrompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 500 }
        })
      }
    );

    const raw = await geminiRes.text();
    console.log('Gemini response:', raw.substring(0, 300));

    const data = JSON.parse(raw);
    if (data.error) return res.status(500).json({ error: data.error.message });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text, location: locationInfo });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}