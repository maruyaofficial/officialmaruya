export default async function handler(req, res) {
  const targetUrl = req.query.url;

  // Validate basic URL structure
  if (!targetUrl || !/^https?:\/\//.test(targetUrl)) {
    return res.status(400).json({ error: 'Invalid or missing ?url=' });
  }

  try {
    // Prepare headers (passthrough useful ones)
    const headers = {};
    const allowedHeaders = [
      'range',
      'referer',
      'origin',
      'user-agent',
      'accept',
      'authorization'
    ];
    for (const h of allowedHeaders) {
      if (req.headers[h]) {
        headers[h] = req.headers[h];
      }
    }

    // Fetch using streaming
    const upstream = await fetch(targetUrl, { headers });

    // Copy response headers
    upstream.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    res.status(upstream.status);
    upstream.body.pipeTo(Writable.toWeb(res));
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
}
