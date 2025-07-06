// /api/proxy.js

import { Readable } from 'stream';

const ALLOWED_HOSTS = [
  '*akamaized.net', // Allows *.akamaized.net (e.g., tglmp01.akamaized.net)
  '*.amagi.tv',
  '*.skygo.mn',
  'nocable.cc',
];

export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl || !/^https?:\/\//.test(targetUrl)) {
    return res.status(400).json({ error: 'Missing or invalid ?url=' });
  }

  const parsedHost = new URL(targetUrl).hostname;

  // Allow subdomains (wildcard match)
  const allowed = ALLOWED_HOSTS.some(allowedHost =>
    parsedHost === allowedHost || parsedHost.endsWith(`.${allowedHost}`)
  );

  if (!allowed) {
    return res.status(403).json({ error: 'Domain not allowed' });
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: req.method || 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Referer': req.headers['referer'] || '',
        'Range': req.headers['range'] || '',
        'Origin': req.headers['origin'] || '',
        'Accept': '*/*',
      },
    });

    // Forward status
    res.status(upstreamResponse.status);

    // Forward selected headers
    upstreamResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Add/override CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Optional: Force download
    // const contentType = upstreamResponse.headers.get('content-type') || 'application/octet-stream';
    // const filename = targetUrl.split('/').pop()?.split('?')[0] || 'file';
    // res.setHeader('Content-Type', contentType);
    // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream to client
    const reader = upstreamResponse.body.getReader();
    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      }
    });

    const nodeStream = streamToNodeReadable(stream);
    nodeStream.pipe(res);

  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
}

// Converts Web ReadableStream to Node.js Readable
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
