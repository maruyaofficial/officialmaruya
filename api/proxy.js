// /api/proxy.js

import { Readable } from 'stream';

const ALLOWED_HOSTS = [
  'example.com',
  'cdn.example.net',
  'media.domain.org',
  // add only domains you trust
];

export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl || !/^https?:\/\//.test(targetUrl)) {
    return res.status(400).json({ error: 'Invalid or missing ?url=' });
  }

  const parsedHost = new URL(targetUrl).hostname;

  if (!ALLOWED_HOSTS.includes(parsedHost)) {
    return res.status(403).json({ error: 'Domain not allowed' });
  }

  try {
    const method = req.method || 'GET';

    const headers = {
      'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
      'Referer': req.headers['referer'] || '',
      'Range': req.headers['range'] || '',
      'Origin': req.headers['origin'] || '',
      'Accept': '*/*',
    };

    const fetchOptions = {
      method,
      headers,
    };

    if (method === 'POST') {
      fetchOptions.body = req;
    }

    const upstreamResponse = await fetch(targetUrl, fetchOptions);

    // Forward status and headers
    res.status(upstreamResponse.status);
    upstreamResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Optional: force client cache behavior (comment out if not needed)
    // res.setHeader('Cache-Control', 'no-store');

    const reader = upstreamResponse.body.getReader();
    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      },
    });

    const nodeStream = streamToNodeReadable(stream);
    nodeStream.pipe(res);
  } catch (err) {
    console.error('Proxy failed:', err);
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
}

// Helper: Convert Web ReadableStream to Node.js Readable
function streamToNodeReadable(stream) {
  const reader = stream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(value);
    }
  });
}
