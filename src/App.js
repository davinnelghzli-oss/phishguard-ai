/* eslint-disable */
import { useState, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #060b14; --bg2: #0d1624; --surface: #111c2e; --border: #1e2d45;
    --accent: #00d4ff; --danger: #ff3b5c; --warn: #ffaa00; --safe: #00e676;
    --text: #e8f0fe; --muted: #5a7090;
    --font-head: 'Syne', sans-serif; --font-mono: 'JetBrains Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-mono); -webkit-text-size-adjust: 100%; }
  .app { min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }
  .grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }
  .glow-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.12; }
  .glow-orb-1 { width: 400px; height: 400px; background: radial-gradient(circle, #00d4ff 0%, transparent 70%); top: -100px; left: -100px; }
  .glow-orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, #ff3b5c 0%, transparent 70%); bottom: -80px; right: -80px; }
  .container { position: relative; z-index: 1; max-width: 960px; margin: 0 auto; padding: 40px 20px 80px; }

  /* Header */
  .header { text-align: center; margin-bottom: 40px; animation: fadeDown 0.6s ease both; }
  .header-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2); color: var(--accent); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; margin-bottom: 16px; }
  .badge-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse-dot 1.5s ease infinite; flex-shrink: 0; }
  .header h1 { font-family: var(--font-head); font-size: clamp(26px, 6vw, 52px); font-weight: 800; line-height: 1.1; background: linear-gradient(135deg, #e8f0fe 0%, var(--accent) 60%, #0088cc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 12px; }
  .header p { color: var(--muted); font-size: clamp(12px, 2.5vw, 14px); line-height: 1.6; max-width: 480px; margin: 0 auto; }

  /* Scanner */
  .scanner-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: clamp(16px, 4vw, 28px); margin-bottom: 20px; animation: fadeUp 0.6s 0.2s ease both; position: relative; overflow: hidden; }
  .scanner-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.6; }
  .scanner-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
  .input-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .url-input { flex: 1; min-width: 0; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 13px 16px; font-family: var(--font-mono); font-size: clamp(12px, 2.5vw, 13px); color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; width: 100%; }
  .url-input::placeholder { color: var(--muted); }
  .url-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
  .scan-btn { background: var(--accent); color: var(--bg); border: none; border-radius: 10px; padding: 13px 24px; font-family: var(--font-head); font-weight: 700; font-size: clamp(12px, 2.5vw, 13px); cursor: pointer; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .scan-btn:hover:not(:disabled) { background: #33deff; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,212,255,0.3); }
  .scan-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .scan-btn .spinner { width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.3); border-top-color: var(--bg); border-radius: 50%; animation: spin 0.7s linear infinite; flex-shrink: 0; }

  /* Stats */
  .stats-row { display: flex; gap: 10px; margin-bottom: 20px; animation: fadeUp 0.6s 0.3s ease both; }
  .stat-box { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: clamp(12px, 3vw, 16px); text-align: center; }
  .stat-num { font-family: var(--font-head); font-size: clamp(22px, 5vw, 28px); font-weight: 800; }
  .stat-num.total { color: var(--accent); }
  .stat-num.phishing { color: var(--danger); }
  .stat-num.safe { color: var(--safe); }
  .stat-label { font-size: clamp(9px, 2vw, 10px); color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }

  /* Result */
  .result-card { border-radius: 16px; padding: clamp(16px, 4vw, 28px); margin-bottom: 20px; border: 1px solid; animation: fadeUp 0.4s ease both; }
  .result-card.phishing { background: rgba(255,59,92,0.07); border-color: rgba(255,59,92,0.3); }
  .result-card.safe { background: rgba(0,230,118,0.07); border-color: rgba(0,230,118,0.3); }
  .result-card.suspicious { background: rgba(255,170,0,0.07); border-color: rgba(255,170,0,0.3); }
  .result-header { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; flex-wrap: wrap; }
  .verdict-icon { font-size: clamp(28px, 6vw, 36px); }
  .verdict-title { font-family: var(--font-head); font-size: clamp(16px, 4vw, 22px); font-weight: 800; }
  .verdict-title.phishing { color: var(--danger); }
  .verdict-title.safe { color: var(--safe); }
  .verdict-title.suspicious { color: var(--warn); }
  .verdict-url { font-size: clamp(10px, 2vw, 11px); color: var(--muted); word-break: break-all; margin-top: 3px; }

  /* Confidence */
  .confidence-bar-wrap { margin-bottom: 18px; }
  .confidence-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 6px; }
  .confidence-bar-bg { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .confidence-bar-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
  .confidence-bar-fill.phishing { background: linear-gradient(90deg, #cc1133, var(--danger)); }
  .confidence-bar-fill.safe { background: linear-gradient(90deg, #00aa55, var(--safe)); }
  .confidence-bar-fill.suspicious { background: linear-gradient(90deg, #cc7700, var(--warn)); }

  /* Sections */
  .analysis-section { margin-top: 20px; }
  .analysis-title { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
  .analysis-text { font-size: clamp(12px, 2.5vw, 13px); line-height: 1.8; color: var(--text); background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 14px; white-space: pre-wrap; word-break: break-word; }

  /* Info Grid */
  .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .info-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
  .info-box-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 5px; }
  .info-box-value { font-size: clamp(11px, 2.5vw, 13px); color: var(--text); font-weight: 500; word-break: break-all; }
  .info-box-value.danger { color: var(--danger); }
  .info-box-value.safe { color: var(--safe); }
  .info-box-value.warn { color: var(--warn); }

  /* Brand */
  .brand-box { background: rgba(255,59,92,0.08); border: 1px solid rgba(255,59,92,0.25); border-radius: 10px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; }
  .brand-icon { font-size: 22px; flex-shrink: 0; }
  .brand-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 4px; }
  .brand-name { font-family: var(--font-head); font-size: clamp(16px, 4vw, 20px); font-weight: 700; color: var(--danger); }

  /* Referrer */
  .referrer-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .referrer-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--border); }
  .referrer-row:last-child { border-bottom: none; }
  .referrer-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .referrer-key { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; min-width: 80px; flex-shrink: 0; margin-top: 2px; }
  .referrer-val { font-size: clamp(11px, 2.5vw, 12px); color: var(--text); word-break: break-all; flex: 1; }
  .referrer-val.bad { color: var(--danger); }
  .referrer-val.good { color: var(--safe); }
  .referrer-val.warn { color: var(--warn); }

  /* Website Preview */
  .preview-wrap { position: relative; width: 100%; background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .preview-bar { background: #1a1a2e; padding: 10px 14px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border); }
  .preview-dots { display: flex; gap: 6px; flex-shrink: 0; }
  .preview-dot { width: 11px; height: 11px; border-radius: 50%; }
  .preview-addr { flex: 1; background: rgba(255,255,255,0.06); border-radius: 6px; padding: 4px 10px; font-size: 11px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .preview-viewport { width: 100%; overflow: hidden; position: relative; }
  .preview-inner { width: 1280px; transform-origin: top left; }
  .preview-img { width: 1280px; height: 720px; object-fit: cover; object-position: top; display: block; border: none; }
  .preview-loading { width: 100%; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--muted); font-size: 12px; gap: 10px; }
  .preview-spinner { width: 24px; height: 24px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  .preview-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(transparent, var(--bg2)); pointer-events: none; }

  /* Features */
  .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-top: 12px; }
  .feature-chip { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-size: 11px; }
  .feature-chip .fc-label { color: var(--muted); margin-bottom: 3px; font-size: 10px; }
  .feature-chip .fc-value { font-weight: 600; color: var(--text); font-size: 12px; }
  .feature-chip .fc-value.bad { color: var(--danger); }
  .feature-chip .fc-value.good { color: var(--safe); }
  .feature-chip .fc-value.warn { color: var(--warn); }

  /* History */
  .history-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: clamp(16px, 4vw, 24px); animation: fadeUp 0.6s 0.4s ease both; }
  .history-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; margin-bottom: 14px; color: var(--muted); }
  .history-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 8px; background: var(--bg2); cursor: default; }
  .history-item:hover { border-color: var(--accent); }
  .history-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .history-dot.phishing { background: var(--danger); }
  .history-dot.safe { background: var(--safe); }
  .history-dot.suspicious { background: var(--warn); }
  .history-url { flex: 1; font-size: 11px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
  .history-badge { font-size: 9px; font-weight: 600; text-transform: uppercase; padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }
  .history-badge.phishing { background: rgba(255,59,92,0.15); color: var(--danger); }
  .history-badge.safe { background: rgba(0,230,118,0.15); color: var(--safe); }
  .history-badge.suspicious { background: rgba(255,170,0,0.15); color: var(--warn); }

  /* Mobile Responsive */
  @media (max-width: 640px) {
    .container { padding: 20px 12px 60px; }
    .header { margin-bottom: 24px; }
    .header-badge { font-size: 9px; padding: 5px 12px; }
    .input-row { flex-direction: column; }
    .scan-btn { width: 100%; justify-content: center; padding: 14px; font-size: 14px; border-radius: 12px; }
    .url-input { font-size: 14px; padding: 14px; border-radius: 12px; }
    .info-grid { grid-template-columns: 1fr 1fr; }
    .stats-row { gap: 6px; }
    .stat-box { padding: 12px 8px; }
    .glow-orb-1 { width: 200px; height: 200px; top: -60px; left: -60px; }
    .glow-orb-2 { width: 160px; height: 160px; bottom: -50px; right: -50px; }
    .referrer-key { min-width: 64px; font-size: 9px; }
    .referrer-val { font-size: 11px; }
    .features-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
    .feature-chip { padding: 8px 10px; }
    .history-item { flex-wrap: nowrap; }
    .result-card { padding: 16px; }
    .brand-box { padding: 12px 14px; }
    .brand-name { font-size: 16px; }
    .analysis-section { margin-top: 16px; }
    .scanner-card { padding: 16px; }
  }
  @media (max-width: 400px) {
    .info-grid { grid-template-columns: 1fr; }
    .features-grid { grid-template-columns: 1fr 1fr; }
    .history-badge { display: none; }
    .stat-label { font-size: 8px; letter-spacing: 0; }
  }

  /* Animations */
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;

function extractUrlFeatures(url) {
  try {
    const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
    const hostname = parsed.hostname;
    return {
      "URL Length": url.length > 75 ? { value: url.length, status: "bad" } : { value: url.length, status: "good" },
      "Has HTTPS": !url.startsWith('https') ? { value: "No", status: "bad" } : { value: "Yes", status: "good" },
      "Subdomain Count": (() => { const c = Math.max(0, hostname.split('.').length - 2); return c > 2 ? { value: c, status: "bad" } : { value: c, status: "good" }; })(),
      "Special Chars": (url.match(/[@%20=&]{3,}/g) || []).length > 2 ? { value: "Suspicious", status: "bad" } : { value: "Normal", status: "good" },
      "Path Depth": (() => { const d = parsed.pathname.split('/').filter(Boolean).length; return d > 5 ? { value: d, status: "warn" } : { value: d, status: "good" }; })(),
      "Suspicious Keywords": (() => {
        const kw = ['login','secure','verify','account','update','bank','paypal','confirm','signin','suspend'];
        const found = kw.filter(k => url.toLowerCase().includes(k));
        return found.length > 0 ? { value: found.slice(0,3).join(', '), status: "warn" } : { value: "None", status: "good" };
      })(),
      "TLD": (() => {
        const risky = ['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.club'];
        const found = risky.find(t => hostname.endsWith(t));
        return found ? { value: found, status: "bad" } : { value: '.' + hostname.split('.').pop(), status: "good" };
      })(),
    };
  } catch(e) { return {}; }
}

function extractJSON(text) {
  try { return JSON.parse(text); } catch(e) {}
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) { try { return JSON.parse(match[1].trim()); } catch(e) {} }
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch(e) {} }
  const verdict = text.includes('PHISHING') ? 'PHISHING' : text.includes('SAFE') ? 'SAFE' : 'SUSPICIOUS';
  const confMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return { verdict, confidence: confMatch ? parseFloat(confMatch[1]) : 75, summary: text.slice(0, 300), risk_factors: [], brand: 'None' };
}

async function analyzeWithGemini(url, features) {
  const featStr = Object.entries(features).map(([k, v]) => k + ': ' + v.value).join('\n');
  const prompt = `You are a cybersecurity AI. Analyze this URL for phishing.
URL: ${url}
Features:
${featStr}
Reply with ONLY a JSON object (no markdown):
{"verdict":"PHISHING","confidence":95,"summary":"...","risk_factors":["..."],"brand":"PayPal"}
verdict = PHISHING, SAFE, or SUSPICIOUS. brand = impersonated brand or "None".`;

  const response = await fetch('/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!response.ok) throw new Error('API error: ' + response.status);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return { analysis: extractJSON(data.text), siteInfo: data.siteInfo, referrerInfo: data.referrerInfo };
}

function flagEmoji(code) {
  if (!code || code.length !== 2) return '🌐';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
}

function PreviewImage({ url }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [containerW, setContainerW] = useState(960);
  const wrapRef = useRef(null);
  const DESKTOP_W = 1280;
  const DESKTOP_H = 720;
  const cleanUrl = url.startsWith('http') ? url : 'https://' + url;
  const previewUrl = `https://image.thum.io/get/width/1280/crop/720/noanimate/${cleanUrl}`;

  const updateSize = () => {
    if (wrapRef.current) setContainerW(wrapRef.current.offsetWidth);
  };

  useState(() => {
    setTimeout(updateSize, 50);
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  });

  const scale = containerW / DESKTOP_W;
  const scaledH = Math.round(DESKTOP_H * scale);

  return (
    <div className="preview-wrap" ref={wrapRef}>
      <div className="preview-bar">
        <div className="preview-dots">
          <div className="preview-dot" style={{ background: '#ff5f57' }} />
          <div className="preview-dot" style={{ background: '#febc2e' }} />
          <div className="preview-dot" style={{ background: '#28c840' }} />
        </div>
        <div className="preview-addr">{cleanUrl}</div>
      </div>
      {!failed ? (
        <div style={{ position: 'relative', width: '100%', height: loaded ? scaledH + 'px' : 'auto', overflow: 'hidden' }}>
          {!loaded && (
            <div className="preview-loading">
              <div className="preview-spinner" />
              <span>Loading desktop preview...</span>
            </div>
          )}
          <div style={{
            width: DESKTOP_W + 'px',
            height: DESKTOP_H + 'px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            display: loaded ? 'block' : 'none',
          }}>
            <img
              src={previewUrl}
              alt="Website preview"
              style={{ width: DESKTOP_W + 'px', height: DESKTOP_H + 'px', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              onLoad={() => { setLoaded(true); updateSize(); }}
              onError={() => setFailed(true)}
            />
          </div>
          {loaded && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(transparent, var(--bg2))', pointerEvents: 'none' }} />
          )}
        </div>
      ) : (
        <div className="preview-loading">
          <span>🚫</span>
          <span>Preview not available for this URL</span>
        </div>
      )}
    </div>
  );
}

export default function PhishingDetector() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const totalScans = history.length;
  const phishingCount = history.filter(h => h.verdict === "PHISHING").length;
  const safeCount = history.filter(h => h.verdict === "SAFE").length;

  const handleScan = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const features = extractUrlFeatures(trimmed);
      const { analysis, siteInfo, referrerInfo } = await analyzeWithGemini(trimmed, features);
      const res = {
        url: trimmed,
        verdict: analysis.verdict || 'SUSPICIOUS',
        confidence: analysis.confidence || 75,
        summary: analysis.summary || 'Analysis complete.',
        risk_factors: analysis.risk_factors || [],
        brand: analysis.brand || 'None',
        features,
        siteInfo: siteInfo || {},
        referrerInfo: referrerInfo || {},
        timestamp: new Date().toLocaleTimeString()
      };
      setResult(res);
      setHistory(prev => [{ url: trimmed, verdict: res.verdict, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
    } catch(e) {
      setError("Analysis failed: " + e.message);
    }
    setLoading(false);
  };

  const vc = v => v === "PHISHING" ? "phishing" : v === "SAFE" ? "safe" : "suspicious";
  const vi = v => v === "PHISHING" ? "🔴" : v === "SAFE" ? "🟢" : "🟡";

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="container">

          <div className="header">
            <div className="header-badge"><span className="badge-dot" />AI Threat Detection · Active</div>
            <h1>G-PhishGuard AI</h1>
            <p>Paste any URL below. Our AI analyzes 60+ signals to detect phishing attacks in real time.</p>
          </div>

          {totalScans > 0 && (
            <div className="stats-row">
              <div className="stat-box"><div className="stat-num total">{totalScans}</div><div className="stat-label">Total Scans</div></div>
              <div className="stat-box"><div className="stat-num phishing">{phishingCount}</div><div className="stat-label">Threats</div></div>
              <div className="stat-box"><div className="stat-num safe">{safeCount}</div><div className="stat-label">Safe</div></div>
            </div>
          )}

          <div className="scanner-card">
            <div className="scanner-label">Enter URL to Analyze</div>
            <div className="input-row">
              <input ref={inputRef} className="url-input" type="text"
                placeholder="https://example.com/login?verify=account"
                value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !loading && handleScan()} />
              <button className="scan-btn" onClick={handleScan} disabled={loading || !url.trim()}>
                {loading ? <><span className="spinner" />Scanning</> : <>&#9889; Scan URL</>}
              </button>
            </div>
            {error && <div style={{ marginTop: 10, fontSize: 12, color: "var(--danger)" }}>{error}</div>}
          </div>

          {result && (
            <div className={"result-card " + vc(result.verdict)}>

              <div className="result-header">
                <span className="verdict-icon">{vi(result.verdict)}</span>
                <div>
                  <div className={"verdict-title " + vc(result.verdict)}>
                    {result.verdict === "PHISHING" ? "PHISHING DETECTED" : result.verdict === "SAFE" ? "SAFE URL" : "SUSPICIOUS"}
                  </div>
                  <div className="verdict-url">{result.url}</div>
                </div>
              </div>

              <div className="confidence-bar-wrap">
                <div className="confidence-label">
                  <span>AI Confidence</span>
                  <span style={{ color: result.verdict === "PHISHING" ? "var(--danger)" : result.verdict === "SAFE" ? "var(--safe)" : "var(--warn)" }}>
                    {Number(result.confidence).toFixed(1)}%
                  </span>
                </div>
                <div className="confidence-bar-bg">
                  <div className={"confidence-bar-fill " + vc(result.verdict)} style={{ width: result.confidence + "%" }} />
                </div>
              </div>

              {result.brand && result.brand !== 'None' && (
                <div className="analysis-section">
                  <div className="analysis-title">Brand Impersonation Detected</div>
                  <div className="brand-box">
                    <span className="brand-icon">🎭</span>
                    <div>
                      <div className="brand-label">This site is impersonating</div>
                      <div className="brand-name">{result.brand}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="analysis-section">
                <div className="analysis-title">Website Preview</div>
                <PreviewImage url={result.url} />
              </div>

              <div className="analysis-section">
                <div className="analysis-title">Server Intelligence</div>
                <div className="info-grid">
                  <div className="info-box">
                    <div className="info-box-label">IP Address</div>
                    <div className="info-box-value">{result.siteInfo?.ip || 'Unknown'}</div>
                  </div>
                  <div className="info-box">
                    <div className="info-box-label">Location</div>
                    <div className="info-box-value">
                      {result.siteInfo?.countryCode ? flagEmoji(result.siteInfo.countryCode) + ' ' : ''}
                      {[result.siteInfo?.city, result.siteInfo?.country].filter(Boolean).join(', ') || 'Unknown'}
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="info-box-label">ISP</div>
                    <div className="info-box-value">{result.siteInfo?.isp || 'Unknown'}</div>
                  </div>
                  <div className="info-box">
                    <div className="info-box-label">Hosting Provider</div>
                    <div className={"info-box-value " + (result.siteInfo?.hosting ? "warn" : "safe")}>
                      {result.siteInfo?.org || 'Unknown'}{result.siteInfo?.hosting ? ' ⚠' : ''}
                    </div>
                  </div>
                </div>
              </div>

              <div className="analysis-section">
                <div className="analysis-title">Referrer & Redirect Analysis</div>
                <div className="referrer-box">
                  <div className="referrer-row">
                    <span className="referrer-icon">🔗</span>
                    <span className="referrer-key">Original</span>
                    <span className="referrer-val">{result.url}</span>
                  </div>
                  <div className="referrer-row">
                    <span className="referrer-icon">{result.referrerInfo?.redirected ? '⚠️' : '✅'}</span>
                    <span className="referrer-key">Redirect</span>
                    <span className={"referrer-val " + (result.referrerInfo?.redirected ? "warn" : "good")}>
                      {result.referrerInfo?.redirected ? 'Yes — redirect detected' : 'No redirect'}
                    </span>
                  </div>
                  {result.referrerInfo?.redirected && (
                    <div className="referrer-row">
                      <span className="referrer-icon">🏁</span>
                      <span className="referrer-key">Final URL</span>
                      <span className="referrer-val">{result.referrerInfo?.finalUrl || 'Unknown'}</span>
                    </div>
                  )}
                  <div className="referrer-row">
                    <span className="referrer-icon">{result.referrerInfo?.crossDomain ? '🚨' : '✅'}</span>
                    <span className="referrer-key">Cross-Domain</span>
                    <span className={"referrer-val " + (result.referrerInfo?.crossDomain ? "bad" : "good")}>
                      {result.referrerInfo?.crossDomain
                        ? 'Yes — redirects to different domain (' + result.referrerInfo?.finalDomain + ')'
                        : 'No — stays on same domain'}
                    </span>
                  </div>
                  <div className="referrer-row">
                    <span className="referrer-icon">📡</span>
                    <span className="referrer-key">Status</span>
                    <span className="referrer-val">{result.referrerInfo?.statusCode || 'Unknown'}</span>
                  </div>
                  <div className="referrer-row">
                    <span className="referrer-icon">{result.referrerInfo?.suspicious ? '🚨' : '✅'}</span>
                    <span className="referrer-key">Risk</span>
                    <span className={"referrer-val " + (result.referrerInfo?.suspicious ? "bad" : "good")}>
                      {result.referrerInfo?.suspicious ? 'Suspicious redirect pattern detected' : 'No suspicious redirect behavior'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="analysis-section">
                <div className="analysis-title">AI Analysis</div>
                <div className="analysis-text">{result.summary}</div>
              </div>

              {result.risk_factors.length > 0 && (
                <div className="analysis-section">
                  <div className="analysis-title">Risk Factors Detected</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.risk_factors.map((rf, i) => (
                      <span key={i} style={{ background: "rgba(255,59,92,0.12)", border: "1px solid rgba(255,59,92,0.25)", color: "#ff8099", fontSize: 11, padding: "4px 10px", borderRadius: 6 }}>{rf}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="analysis-section">
                <div className="analysis-title">URL Feature Breakdown</div>
                <div className="features-grid">
                  {Object.entries(result.features).map(([key, val]) => (
                    <div className="feature-chip" key={key}>
                      <div className="fc-label">{key}</div>
                      <div className={"fc-value " + val.status}>{String(val.value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, fontSize: 10, color: "var(--muted)", textAlign: "right" }}>
                Analyzed at {result.timestamp} · Powered by Gemini AI
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="history-card">
              <div className="history-title">Recent Scans</div>
              {history.map((item, i) => (
                <div className="history-item" key={i} onClick={() => setUrl(item.url)}>
                  <span className={"history-dot " + vc(item.verdict)} />
                  <span className="history-url" title={item.url}>{item.url}</span>
                  <span className={"history-badge " + vc(item.verdict)}>{item.verdict}</span>
                  <span style={{ fontSize: 10, color: "var(--muted)", flexShrink: 0 }}>{item.time}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 48, fontSize: 11, color: "var(--muted)", lineHeight: 1.8 }}>
            <div style={{ marginBottom: 6, fontFamily: "var(--font-head)", fontSize: 13, color: "var(--border)" }}>G-PhishGuard AI</div>
            AI-Based Phishing Website Detection System · Always verify results independently
            <br />@ 2026 Ghazali Davin El
          </div>
        </div>
      </div>
    </>
  );
}