export default function handler(req, res) {
  const { channel } = req.query;

  // This mock Widevine license only works with players that accept clear content with JWKS-style key sets.
  const keys = {
    animax: {
      kid: "92032b0e41a543fb9830751273b8debd",
      k: "03f8b65e2af785b10d6634735dbe6c11"
    },
    cartoon: {
      kid: "a2d1f552ff9541558b3296b5a932136b",
      k: "cdd48fa884dc0c3a3f85aeebca13d444"
    }
    // Add more here
  };

  const entry = keys[channel];
  if (!entry) {
    return res.status(404).json({ error: "Unknown channel" });
  }

  const response = {
    keys: [
      {
        kty: "oct",
        alg: "A128KW",
        kid: entry.kid,
        k: entry.k
      }
    ]
  };

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.status(200).json(response);
}
