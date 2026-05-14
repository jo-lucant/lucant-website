const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use('/en', express.static(path.join(__dirname, 'en')));
app.use('/es', express.static(path.join(__dirname, 'es')));
app.get(['/en', '/en/'], (req, res) => res.sendFile(path.join(__dirname, 'en', 'index.html')));
app.get(['/es', '/es/'], (req, res) => res.sendFile(path.join(__dirname, 'es', 'index.html')));

app.get('/', (req, res) => {
  const stored = req.cookies?.lucant_lang;
  if (stored === 'en') return res.redirect('/en/');
  if (stored === 'es') return res.redirect('/es/');
  const lang = req.headers['accept-language'] || '';
  res.redirect(/^es/i.test(lang) ? '/es/' : '/en/');
});

const publicFiles = [
  'piap.html', 'geocat.html',
  'logo.svg', 'og-image.svg',
  'sitemap.xml', 'robots.txt'
];
publicFiles.forEach(f => {
  app.get('/' + f, (req, res) => res.sendFile(path.join(__dirname, f)));
});
app.use('/go', express.static(path.join(__dirname, 'go')));

app.get('*', (req, res) => res.redirect('/'));

app.listen(PORT, () => console.log(`Running on ${PORT}`));
