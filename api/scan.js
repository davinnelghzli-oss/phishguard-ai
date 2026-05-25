export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  console.log('Request received');

  let siteInfo = { ip: 'Unknown', city: '', region: '', country: '', countryCode: '', isp: 'Unknown', org: 'Unknown', hosting: false, location: 'Unknown' };
  let referrerInfo = { redirected: false, crossDomain: false, suspicious: false, finalUrl: '', finalDomain: '', statusCode: 'N/A' };

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

    // Extract URL
    const urlMatch = prompt.match(/URL:\s*(\S+)/);
    if (urlMatch) {
      const rawUrl = urlMatch[1];
      let hostname = '';
      try {
        const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
        hostname = parsed.hostname;
      } catch(e) { console.log('URL parse failed:', e.message); }

      // IP lookup — wrapped separately so it never crashes the whole function
      if (hostname) {
        try {
          console.log('Looking up IP for:', hostname);
          const ipRes = await fetch(`http://ip-api.com/json/${hostname}?fields=status,country,countryCode,regionName,city,isp,org,hosting,query`, { signal: AbortSignal.timeout(4000) });
          const ipData = await ipRes.json();
          if (ipData.status === 'success') {
            siteInfo = {
              ip: ipData.query || 'Unknown',
              city: ipData.city || '',
              region: ipData.regionName || '',
              country: ipData.country || '',
              countryCode: ipData.countryCode || '',
              isp: ipData.isp || 'Unknown',
              org: ipData.org || 'Unknown',
              hosting: ipData.hosting || false,
              location: [ipData.city, ipData.regionName, ipData.country].filter(Boolean).join(', '),
            };
            console.log('IP lookup success:', siteInfo.ip);
          }
        } catch(e) { console.log('IP lookup failed (non-fatal):', e.message); }

        // Referrer/redirect analysis — wrapped separately
        try {
          console.log('Checking redirects for:', rawUrl);
          const checkUrl = rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl;
          const parsed = new URL(checkUrl);
          const headRes = await fetch(checkUrl, {
            method: 'HEAD',
            redirect: 'follow',
            signal: AbortSignal.timeout(4000),
          });
          const finalUrl = headRes.url || checkUrl;
          let finalDomain = parsed.hostname;
          try { finalDomain = new URL(finalUrl).hostname; } catch(e) {}
          const redirected = finalUrl !== checkUrl;
          const crossDomain = parsed.hostname !== finalDomain;
          referrerInfo = {
            redirected,
            crossDomain,
            finalUrl,
            originalDomain: parsed.hostname,
            finalDomain,
            suspicious: redirected && crossDomain,
            statusCode: headRes.status,
          };
          console.log('Redirect check done. Redirected:', redirected);
        } catch(e) { console.log('Redirect check failed (non-fatal):', e.message); }
      }
    }

    // Call Gemini
    console.log('Calling Gemini...');
    const enrichedPrompt = prompt + `

Server Info:
- IP: ${siteInfo.ip}
- Location: ${siteInfo.location}
- ISP: ${siteInfo.isp}
- Org: ${siteInfo.org}
- Hosting: ${siteInfo.hosting ? 'Yes' : 'No'}
- Redirect: ${referrerInfo.redirected ? 'Yes' : 'No'}
- Cross-Domain Redirect: ${referrerInfo.crossDomain ? 'Yes' : 'No'}

Reply with ONLY this JSON (no markdown, no extra text):
{"verdict":"PHISHING","confidence":95,"summary":"...","risk_factors":["..."],"brand":"PayPal or None"}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enrichedPrompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 600 }
        }),
        signal: AbortSignal.timeout(8000),
      }
    );

    const raw = await geminiRes.text();
    console.log('Gemini raw (first 200):', raw.substring(0, 200));

    let data;
    try { data = JSON.parse(raw); }
    catch(e) { return res.status(500).json({ error: 'Failed to parse Gemini response: ' + raw.substring(0, 100) }); }

    if (data.error) {
      console.error('Gemini API error:', data.error.message);
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Success! Text length:', text.length);
    return res.status(200).json({ text, siteInfo, referrerInfo });

  } catch (err) {
    console.error('Top-level error:', err.message);
    return res.status(500).json({ error: err.message || 'Unknown server error' });
  }
}