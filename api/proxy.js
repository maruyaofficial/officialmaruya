export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl || !/^https?:\/\//.test(targetUrl)) {
    return res.status(400).json({ error: 'Invalid or missing ?url=' });
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Referer': req.headers['referer'] || 'https://vercel.app/',
        'Origin': req.headers['origin'] || '',
        'Range': req.headers['range'] || '',
        'Accept': '*/*',
      }
    });

    // Copy headers
    response.headers.forEach((v, k) => res.setHeader(k, v));
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(response.status);
    response.body.pipeTo(Writable.toWeb(res));
  } catch (error) {
    res.status(500).json({
      error: 'Proxy fetch failed',
      details: error.message,
      url: targetUrl
    });
  }
}
