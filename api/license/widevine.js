// /api/license/widevine.js

export default function handler(req, res) {
  const { channel } = req.query;

  const keys = {
    animax: {
      kid: '92032b0e41a543fb9830751273b8debd',
      k: '03f8b65e2af785b10d6634735dbe6c11',
    },
    // add more channels here
  };

  const entry = keys[channel];
  if (!entry) return res.status(404).json({ error: 'Unknown channel' });

  const response = {
    keys: [
      {
        kty: 'oct',
        kid: entry.kid,
        k: entry.k,
      },
    ],
  };

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(response);
}
