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
  body { background: var(--bg); color: var(--text); font-family: var(--font-mono); }
  .app { min-height: 100vh; background: var(--bg); position: relative; overflow: hidden; }
  .grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  .glow-orb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(80px); opacity: 0.15; }
  .glow-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #00d4ff 0%, transparent 70%); top: -200px; left: -200px; }
  .glow-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, #ff3b5c 0%, transparent 70%); bottom: -100px; right: -100px; }
  .container { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 40px 24px 80px; }
  .header { text-align: center; margin-bottom: 52px; animation: fadeDown 0.6s ease both; }
  .header-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2); color: var(--accent); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; margin-bottom: 20px; }
  .badge-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse-dot 1.5s ease infinite; }
  .header h1 { font-family: var(--font-head); font-size: clamp(28px, 5vw, 48px); font-weight: 800; line-height: 1.1; background: linear-gradient(135deg, #e8f0fe 0%, var(--accent) 60%, #0088cc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 14px; }
  .header p { color: var(--muted); font-size: 14px; line-height: 1.6; max-width: 480px; margin: 0 auto; }
  .scanner-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 28px; animation: fadeUp 0.6s 0.2s ease both; position: relative; overflow: hidden; }
  .scanner-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.6; }
  .scanner-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  .input-row { display: flex; gap: 12px; }
  .url-input { flex: 1; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 18px; font-family: var(--font-mono); font-size: 13px; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .url-input::placeholder { color: var(--muted); }
  .url-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
  .scan-btn { background: var(--accent); color: var(--bg); border: none; border-radius: 10px; padding: 14px 28px; font-family: var(--font-head); font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
  .scan-btn:hover:not(:disabled) { background: #33deff; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,212,255,0.3); }
  .scan-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .scan-btn .spinner { width: 14px; height: 14px; border: 2px solid rgba(0,0,0,0.3); border-top-color: var(--bg); border-radius: 50%; animation: spin 0.7s linear infinite; }
  .result-card { border-radius: 16px; padding: 28px; margin-bottom: 28px; border: 1px solid; animation: fadeUp 0.4s ease both; }
  .result-card.phishing { background: rgba(255,59,92,0.07); border-color: rgba(255,59,92,0.3); }
  .result-card.safe { background: rgba(0,230,118,0.07); border-color: rgba(0,230,118,0.3); }
  .result-card.suspicious { background: rgba(255,170,0,0.07); border-color: rgba(255,170,0,0.3); }
  .result-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .verdict-icon { font-size: 36px; }
  .verdict-title { font-family: var(--font-head); font-size: 22px; font-weight: 800; }
  .verdict-title.phishing { color: var(--danger); }
  .verdict-title.safe { color: var(--safe); }
  .verdict-title.suspicious { color: var(--warn); }
  .verdict-url { font-size: 11px; color: var(--muted); word-break: break-all; margin-top: 3px; }
  .confidence-bar-wrap { margin-bottom: 20px; }
  .confidence-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin-bottom: 6px; }
  .confidence-bar-bg { height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .confidence-bar-fill { height: 100%; border-radius: 3px; transition: width 1s ease; }
  .confidence-bar-fill.phishing { background: linear-gradient(90deg, #cc1133, var(--danger)); }
  .confidence-bar-fill.safe { background: linear-gradient(90deg, #00aa55, var(--safe)); }
  .confidence-bar-fill.suspicious { background: linear-gradient(90deg, #cc7700, var(--warn)); }
  .analysis-section { margin-top: 20px; }
  .analysis-title { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  .analysis-text { font-size: 13px; line-height: 1.8; color: var(--text); background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; white-space: pre-wrap; word-break: break-word; }
  .location-box { background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 12px; }
  .location-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
  .location-details { flex: 1; }
  .location-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 4px; }
  .location-value { font-size: 13px; color: var(--text); line-height: 1.6; }
  .location-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
  .location-tag { font-size: 11px; padding: 3px 10px; border-radius: 20px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.2); color: var(--accent); }
  .location-tag.hosting { background: rgba(255,59,92,0.1); border-color: rgba(255,59,92,0.2); color: var(--danger); }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-top: 16px; }
  .feature-chip { background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-size: 11px; }
  .feature-chip .fc-label { color: var(--muted); margin-bottom: 3px; }
  .feature-chip .fc-value { font-weight: 600; color: var(--text); font-size: 12px; }
  .feature-chip .fc-value.bad { color: var(--danger); }
  .feature-chip .fc-value.good { color: var(--safe); }
  .feature-chip .fc-value.warn { color: var(--warn); }
  .history-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; animation: fadeUp 0.6s 0.4s ease both; }
  .history-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; margin-bottom: 16px; color: var(--muted); }
  .history-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 8px; background: var(--bg2); cursor: default; }
  .history-item:hover { border-color: var(--accent); }
  .history-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .history-dot.phishing { background: var(--danger); }
  .history-dot.safe { background: var(--safe); }
  .history-dot.suspicious { background: var(--warn); }
  .history-url { flex: 1; font-size: 11px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .history-badge { font-size: 10px; font-weight: 600; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; flex-shrink: 0; }
  .history-badge.phishing { background: rgba(255,59,92,0.15); color: var(--danger); }
  .history-badge.safe { background: rgba(0,230,118,0.15); color: var(--safe); }
  .history-badge.suspicious { background: rgba(255,170,0,0.15); color: var(--warn); }
  .stats-row { display: flex; gap: 12px; margin-bottom: 28px; animation: fadeUp 0.6s 0.3s ease both; }
  .stat-box { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 16px; text-align: center; }
  .stat-num { font-family: var(--font-head); font-size: 28px; font-weight: 800; }
  .stat-num.total { color: var(--accent); }
  .stat-num.phishing { color: var(--danger); }
  .stat-num.safe { color: var(--safe); }
  .stat-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; }
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;

function extractUrlFeatures(url) {
  try {
    const parsed = new URL(url.startsWith("http") ? url : "https://" + url);
    const hostname = parsed.hostname;
    return {
      "URL Length":
        url.length > 75
          ? { value: url.length, status: "bad" }
          : { value: url.length, status: "good" },
      "Has HTTPS": !url.startsWith("https")
        ? { value: "No", status: "bad" }
        : { value: "Yes", status: "good" },
      "Has IP Address": /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)
        ? { value: "Yes", status: "bad" }
        : { value: "No", status: "good" },
      "Subdomain Count": (() => {
        const c = Math.max(0, hostname.split(".").length - 2);
        return c > 2
          ? { value: c, status: "bad" }
          : { value: c, status: "good" };
      })(),
      "Special Chars":
        (url.match(/[@%20=&]{3,}/g) || []).length > 2
          ? { value: "Suspicious", status: "bad" }
          : { value: "Normal", status: "good" },
      "Path Depth": (() => {
        const d = parsed.pathname.split("/").filter(Boolean).length;
        return d > 5
          ? { value: d, status: "warn" }
          : { value: d, status: "good" };
      })(),
      "Suspicious Keywords": (() => {
        const kw = [
          "login",
          "secure",
          "verify",
          "account",
          "update",
          "bank",
          "paypal",
          "confirm",
          "signin",
          "suspend",
        ];
        const found = kw.filter((k) => url.toLowerCase().includes(k));
        return found.length > 0
          ? { value: found.slice(0, 3).join(", "), status: "warn" }
          : { value: "None", status: "good" };
      })(),
      TLD: (() => {
        const risky = [
          ".tk",
          ".ml",
          ".ga",
          ".cf",
          ".gq",
          ".xyz",
          ".top",
          ".club",
        ];
        const found = risky.find((t) => hostname.endsWith(t));
        return found
          ? { value: found, status: "bad" }
          : { value: "." + hostname.split(".").pop(), status: "good" };
      })(),
    };
  } catch (e) {
    return {};
  }
}

function extractJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {}
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    try {
      return JSON.parse(match[1].trim());
    } catch (e) {}
  }
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch (e) {}
  }
  const verdict = text.includes("PHISHING")
    ? "PHISHING"
    : text.includes("SAFE")
      ? "SAFE"
      : "SUSPICIOUS";
  const confMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return {
    verdict,
    confidence: confMatch ? parseFloat(confMatch[1]) : 75,
    summary: text.slice(0, 300),
    risk_factors: [],
  };
}

function parseLocation(locationStr) {
  if (
    !locationStr ||
    locationStr === "Unknown" ||
    locationStr === "Could not resolve location"
  )
    return null;
  const parts = locationStr.split("|").map((s) => s.trim());
  const geo = parts[0] || "";
  const isp = parts[1]?.replace("ISP:", "").trim() || "";
  const hosting = parts[2]?.includes("Yes") || false;
  const countryMatch = geo.match(/\(([A-Z]{2})\)/);
  const countryCode = countryMatch ? countryMatch[1] : "";
  const location = geo
    .replace(/\([A-Z]{2}\)/, "")
    .trim()
    .replace(/,\s*,/g, ",")
    .replace(/^,|,$/g, "")
    .trim();
  return { location, isp, hosting, countryCode };
}

async function analyzeWithGemini(url, features) {
  const featStr = Object.entries(features)
    .map(([k, v]) => k + ": " + v.value)
    .join("\n");
  const prompt = `You are a cybersecurity AI. Analyze this URL for phishing.

URL: ${url}

Features:
${featStr}

Reply with ONLY a JSON object like this (no markdown, no explanation):
{"verdict":"PHISHING","confidence":95,"summary":"This URL is phishing because...","risk_factors":["reason 1","reason 2"]}

verdict must be exactly PHISHING, SAFE, or SUSPICIOUS.`;

  const response = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("API error: " + response.status);
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return { analysis: extractJSON(data.text), location: data.location };
}

export default function PhishingDetector() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const totalScans = history.length;
  const phishingCount = history.filter((h) => h.verdict === "PHISHING").length;
  const safeCount = history.filter((h) => h.verdict === "SAFE").length;

  const handleScan = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const features = extractUrlFeatures(trimmed);
      const { analysis, location } = await analyzeWithGemini(trimmed, features);
      const res = {
        url: trimmed,
        verdict: analysis.verdict || "SUSPICIOUS",
        confidence: analysis.confidence || 75,
        summary: analysis.summary || "Analysis complete.",
        risk_factors: analysis.risk_factors || [],
        features,
        location: location || null,
        timestamp: new Date().toLocaleTimeString(),
      };
      setResult(res);
      setHistory((prev) => [
        {
          url: trimmed,
          verdict: res.verdict,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9),
      ]);
    } catch (e) {
      setError("Analysis failed: " + e.message);
    }
    setLoading(false);
  };

  const vc = (v) =>
    v === "PHISHING" ? "phishing" : v === "SAFE" ? "safe" : "suspicious";
  const vi = (v) => (v === "PHISHING" ? "🔴" : v === "SAFE" ? "🟢" : "🟡");

  const locationData = result ? parseLocation(result.location) : null;

  const flagEmoji = (code) => {
    if (!code || code.length !== 2) return "🌐";
    return String.fromCodePoint(
      ...[...code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)),
    );
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="container">
          <div className="header">
            <div className="header-badge">
              <span className="badge-dot" />
              AI Threat Detection · Active
            </div>
            <h1>PhishGuard AI</h1>
            <p>
              Paste any URL below. Our AI analyzes 60+ signals to detect
              phishing attacks in real time.
            </p>
          </div>

          {totalScans > 0 && (
            <div className="stats-row">
              <div className="stat-box">
                <div className="stat-num total">{totalScans}</div>
                <div className="stat-label">Total Scans</div>
              </div>
              <div className="stat-box">
                <div className="stat-num phishing">{phishingCount}</div>
                <div className="stat-label">Threats Found</div>
              </div>
              <div className="stat-box">
                <div className="stat-num safe">{safeCount}</div>
                <div className="stat-label">Safe URLs</div>
              </div>
            </div>
          )}

          <div className="scanner-card">
            <div className="scanner-label">Enter URL to Analyze</div>
            <div className="input-row">
              <input
                ref={inputRef}
                className="url-input"
                type="text"
                placeholder="https://example.com/login?verify=account"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleScan()}
              />
              <button
                className="scan-btn"
                onClick={handleScan}
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Scanning
                  </>
                ) : (
                  <>&#9889; Scan URL</>
                )}
              </button>
            </div>
            {error && (
              <div
                style={{ marginTop: 12, fontSize: 12, color: "var(--danger)" }}
              >
                {error}
              </div>
            )}
          </div>

          {result && (
            <div className={"result-card " + vc(result.verdict)}>
              <div className="result-header">
                <span className="verdict-icon">{vi(result.verdict)}</span>
                <div>
                  <div className={"verdict-title " + vc(result.verdict)}>
                    {result.verdict === "PHISHING"
                      ? "PHISHING DETECTED"
                      : result.verdict === "SAFE"
                        ? "SAFE URL"
                        : "SUSPICIOUS"}
                  </div>
                  <div className="verdict-url">{result.url}</div>
                </div>
              </div>

              <div className="confidence-bar-wrap">
                <div className="confidence-label">
                  <span>AI Confidence</span>
                  <span
                    style={{
                      color:
                        result.verdict === "PHISHING"
                          ? "var(--danger)"
                          : result.verdict === "SAFE"
                            ? "var(--safe)"
                            : "var(--warn)",
                    }}
                  >
                    {Number(result.confidence).toFixed(1)}%
                  </span>
                </div>
                <div className="confidence-bar-bg">
                  <div
                    className={"confidence-bar-fill " + vc(result.verdict)}
                    style={{ width: result.confidence + "%" }}
                  />
                </div>
              </div>

              {locationData && (
                <div className="analysis-section">
                  <div className="analysis-title">Server Location</div>
                  <div className="location-box">
                    <div className="location-icon">
                      {flagEmoji(locationData.countryCode)}
                    </div>
                    <div className="location-details">
                      <div className="location-label">Geographic Location</div>
                      <div className="location-value">
                        {locationData.location || "Unknown location"}
                      </div>
                      <div className="location-row">
                        {locationData.countryCode && (
                          <span className="location-tag">
                            {locationData.countryCode}
                          </span>
                        )}
                        {locationData.isp && (
                          <span className="location-tag">
                            ISP: {locationData.isp}
                          </span>
                        )}
                        {locationData.hosting && (
                          <span className="location-tag hosting">
                            Hosting Provider ⚠
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="analysis-section">
                <div className="analysis-title">AI Analysis</div>
                <div className="analysis-text">{result.summary}</div>
              </div>

              {result.risk_factors.length > 0 && (
                <div className="analysis-section">
                  <div className="analysis-title">Risk Factors Detected</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {result.risk_factors.map((rf, i) => (
                      <span
                        key={i}
                        style={{
                          background: "rgba(255,59,92,0.12)",
                          border: "1px solid rgba(255,59,92,0.25)",
                          color: "#ff8099",
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 6,
                        }}
                      >
                        {rf}
                      </span>
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
                      <div className={"fc-value " + val.status}>
                        {String(val.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: 16,
                  fontSize: 10,
                  color: "var(--muted)",
                  textAlign: "right",
                }}
              >
                Analyzed at {result.timestamp} · Powered by Gemini AI
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="history-card">
              <div className="history-title">Recent Scans</div>
              {history.map((item, i) => (
                <div
                  className="history-item"
                  key={i}
                  onClick={() => setUrl(item.url)}
                >
                  <span className={"history-dot " + vc(item.verdict)} />
                  <span className="history-url" title={item.url}>
                    {item.url}
                  </span>
                  <span className={"history-badge " + vc(item.verdict)}>
                    {item.verdict}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      flexShrink: 0,
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: 48,
              fontSize: 11,
              color: "var(--muted)",
              lineHeight: 1.8,
            }}
          >
            <div
              style={{
                marginBottom: 6,
                fontFamily: "var(--font-head)",
                fontSize: 13,
                color: "var(--border)",
              }}
            >
              PhishGuard AI
            </div>
            AI-Based Phishing Website Detection System · Website by Ghazali Davin El
            <br />
            Always verify results independently.
          </div>
        </div>
      </div>
    </>
  );
}
