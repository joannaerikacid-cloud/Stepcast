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

  var key = req.body && req.body.key;
  if (!key || typeof key !== "string" || key.trim() === "") {
    return res.status(400).json({ valid: false, error: "No key provided" });
  }

  var apiKey = process.env.LEMON_SQUEEZY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ valid: false, error: "Server configuration error" });
  }

  try {
    var body = "license_key=" + encodeURIComponent(key.trim());

    var response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + apiKey
      },
      body: body
    });

    var data = await response.json();

    if (data.valid === true) {
      return res.status(200).json({ valid: true });
    }

    return res.status(200).json({ valid: false, error: "Key not recognised. Check your email and try again." });

  } catch (e) {
    return res.status(500).json({ valid: false, error: "Verification failed. Please try again." });
  }
};
