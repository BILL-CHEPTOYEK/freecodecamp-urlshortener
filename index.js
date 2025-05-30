require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', express.json(), function(req, res) {
  const url = req.body.url;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Here you would typically save the URL to a database and return a short URL
  // For simplicity, we will just return the original URL
  res.json({ original_url: url, short_url: '3' });
}
);

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
