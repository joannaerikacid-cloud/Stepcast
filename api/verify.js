export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ error: "Missing license key" });
    }

    const response = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        license_key: licenseKey,
        instance_name: "stepcast-user"
      })
    });

    const data = await response.json();

    if (data.valid && data.license_key.status === "active") {
      return res.status(200).json({ valid: true });
    }

    return res.status(200).json({ valid: false });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
