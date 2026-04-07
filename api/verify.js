module.exports = async function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://stepcasttours.com");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ valid: false, error: "Method not allowed" });
  }

  // Handle body parsing defensively
  var body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }

  var key = body && body.key;
  if (!key || typeof key !== "string" || key.trim() === "") {
    return res.status(400).json({ valid: false, error: "No key provided" });
  }

  key = key.trim();

  var bypassCodes = [
    "VALENCIA2026",
    "SEVILLE2026",
    "LISBON2026",
    "BRUSSELS2026",
    "LONDON2026",
    "PARIS2026",
    "AMSTERDAM2026",
    "BARCELONA2026"
  ];
  if (bypassCodes.indexOf(key.toUpperCase()) !== -1) {
    return res.status(200).json({ valid: true });
  }

  try {
    var response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "license_key=" + encodeURIComponent(key)
    });

    var data = await response.json();

    if (data.valid === true) {
      return res.status(200).json({ valid: true });
    }

    var errMsg = (data.error) ? data.error : "Invalid or expired key.";
    return res.status(200).json({ valid: false, error: errMsg });

  } catch (e) {
    return res.status(500).json({ valid: false, error: "Verification failed. Please try again." });
  }
};
