// Node 18+
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const LRU = require('lru-cache');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { translateText } = require('./services/translator');
const { parsePdf, parseHtml } = require('./services/fileParser');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.ORIGINS || '*')
  .split(',')
  .map(s => s.trim());

app.use(helmet());
app.use(express.json({ limit: '10mb' })); // Increased limit for large texts
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: false
  })
);
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false
  })
);
if (process.env.LOG_LEVEL !== 'silent') {
  app.use(morgan('tiny'));
}

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

const cache = new LRU({
  max: 5000,
  ttl: 1000 * 60 * 60 * 12 // 12h
});

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, 'client/dist')));

app.post('/api/translate', async (req, res) => {
  try {
    const { q, source = 'auto', target = 'zh-CN' } = req.body || {};
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'q (text) is required' });
    }

    const cacheKey = `v2:${source}:${target}:${q}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ translatedText: cached });

    const translatedText = await translateText(q, source, target);
    cache.set(cacheKey, translatedText);

    return res.json({ translatedText });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'translation failed' });
  }
});

app.post('/api/translate/file', upload.single('file'), async (req, res) => {
  try {
    const { source = 'auto', target = 'zh-CN' } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let text = '';
    if (file.mimetype === 'application/pdf') {
      text = await parsePdf(file.path);
    } else if (file.mimetype === 'text/html') {
      text = await parseHtml(file.path);
    } else {
      // Default to treating as text
      text = fs.readFileSync(file.path, 'utf8');
    }

    // Clean up uploaded file
    fs.unlinkSync(file.path);

    if (!text) {
      return res.status(400).json({ error: 'Could not extract text from file' });
    }

    // Translate extracted text
    // For large files, we might need to split, but for now let's try direct translation
    // or split by chunks if needed. Google Translate API might handle some length,
    // but usually we need to chunk.
    // Simple chunking for now:
    const chunks = [];
    let remain = text;
    while (remain.length > 0) {
      const chunk = remain.slice(0, 4000); // Safe limit
      chunks.push(chunk);
      remain = remain.slice(4000);
    }

    const results = await Promise.all(
      chunks.map(chunk => translateText(chunk, source, target))
    );

    const translatedText = results.join('\n');
    return res.json({ translatedText });

  } catch (err) {
    console.error(err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: err.message || 'file translation failed' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

// Catch-all handler to serve React app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`HF translator backend listening on http://localhost:${PORT}`);
});