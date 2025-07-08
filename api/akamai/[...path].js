export default async function handler(req, res) {
  const {
    query: { group, file },
  } = req;

  if (!group || !file) {
    return res.status(400).json({ error: "Missing group or file parameter." });
  }

  const upstreamUrl = `https://qp-pldt-live-${group}-prod.akamaized.net/out/u/${file}`;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Accept': '*/*',
        'Referer': req.headers['referer'] || '',
        'Range': req.headers['range'] || '',
        'Origin': req.headers['origin'] || ''
      }
    });

    res.status(upstreamResponse.status);
    upstreamResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    const body = upstreamResponse.body;
    if (!body) return res.status(500).send("No upstream body");

    body.pipeTo(new WritableStream({
      write(chunk) {
        res.write(chunk);
      },
      close() {
        res.end();
      },
      abort(err) {
        console.error("Stream error:", err);
        res.end();
      }
    }));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed", details: err.message });
  }
}