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

    const urlMatch = prompt.match(/URL:\s*(\S+)/);
    let siteInfo = { ip: 'Unknown', location: 'Unknown', isp: 'Unknown', org: 'Unknown', hosting: false, countryCode: '', city: '', region: '', country: '' };
    let referrerInfo = { finalUrl: '', redirectCount: 0, redirectChain: [], suspicious: false };

    if (urlMatch) {
      try {
        const rawUrl = urlMatch[1];
        const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
        const hostname = parsed.hostname;

        // IP & Location lookup
        const ipRes = await fetch(`http://ip-api.com/json/${hostname}?fields=status,country,countryCode,regionName,city,isp,org,hosting,query`);
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
        }

        // Referrer / redirect chain analysis
        try {
          const checkUrl = rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl;
          const controller = new AbortController();
          setTimeout(() => controller.abort(), 5000);
          const headRes = await fetch(checkUrl, {
            method: 'HEAD',
            redirect: 'follow',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PhishGuardBot/1.0)' }
          });
          const finalUrl = headRes.url;
          const redirected = finalUrl !== checkUrl;
          const originalDomain = parsed.hostname;
          const finalDomain = new URL(finalUrl).hostname;
          const crossDomain = originalDomain !== finalDomain;

          referrerInfo = {
            finalUrl: finalUrl,
            redirected,
            crossDomain,
            originalDomain,
            finalDomain,
            suspicious: crossDomain && redirected,
            statusCode: headRes.status,
          };
        } catch(e) {
          referrerInfo = { finalUrl: rawUrl, redirected: false, crossDomain: false, suspicious: false, statusCode: 'N/A', note: 'Could not follow redirects' };
        }

      } catch(e) {
        console.log('Lookup failed:', e.message);
      }
    }

    const enrichedPrompt = prompt + `

Server Info:
- IP Address: ${siteInfo.ip}
- Location: ${siteInfo.location}
- ISP: ${siteInfo.isp}
- Organization: ${siteInfo.org}
- Hosting Provider: ${siteInfo.hosting ? 'Yes (suspicious)' : 'No'}
- Redirect Detected: ${referrerInfo.redirected ? 'Yes' : 'No'}
- Cross-Domain Redirect: ${referrerInfo.crossDomain ? 'Yes - suspicious' : 'No'}
- Final URL: ${referrerInfo.finalUrl}

Reply with ONLY this JSON (no markdown):
{"verdict":"PHISHING","confidence":95,"summary":"...","risk_factors":["..."],"brand":"PayPal"}
verdict = PHISHING, SAFE, or SUSPICIOUS. brand = impersonated brand or "None".`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: enrichedPrompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 600 }
        })
      }
    );

    const raw = await geminiRes.text();
    const data = JSON.parse(raw);
    if (data.error) return res.status(500).json({ error: data.error.message });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return res.status(200).json({ text, siteInfo, referrerInfo });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}