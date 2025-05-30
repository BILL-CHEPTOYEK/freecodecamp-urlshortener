require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// In-memory store
let urlDatabase = [];
let id = 1;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: false })); // for form submissions

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// POST to shorten a URL
app.post('/api/shorturl', (req, res) => {
  const inputUrl = req.body.url;

  try {
    const parsedUrl = new URL(inputUrl);
    dns.lookup(parsedUrl.hostname, (err) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }

      const shortId = id++;
      urlDatabase[shortId] = inputUrl;

      res.json({
        original_url: inputUrl,
        short_url: shortId
      });
    });
  } catch {
    return res.json({ error: 'invalid url' });
  }
});

// GET to redirect to original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortId = Number(req.params.short_url);
  const originalUrl = urlDatabase[shortId];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.status(404).json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
