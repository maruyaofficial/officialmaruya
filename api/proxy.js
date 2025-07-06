export default async function handler(req, res) {

  const url = req.query.url;
  const response = await fetch(url);
  const data = await response.body;
  res.setHeader("Access-Control-Allow-Origin", "*");
  response.headers.forEach((v, k) => res.setHeader(k, v));
  data.pipe(res);
}


export default async function handler(req, res) {


  if (!targetUrl || !/^https?:\/\//.test(targetUrl)) {
    return res.status(400).json({ error: 'Invalid or missing ?url=' });
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Referer': req.headers['referer'] || '',
        'Range': req.headers['range'] || '',
        'Origin': req.headers['origin'] || '',
        'Accept': '*/*',
      },
    });

    // Copy status and headers
    res.status(upstreamResponse.status);
    upstreamResponse.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Stream video/audio properly
    const reader = upstreamResponse.body.getReader();
    const stream = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      }
    });

    const nodeStream = streamToNodeReadable(stream);
    nodeStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed', details: err.message });
  }
}

// Helper: Convert Web ReadableStream to Node.js Stream
import { Readable } from 'stream';
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
