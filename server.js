const express = require('express');
const path = require('path');
const app = express();


process.env.DEPLOY_ENV = 'PRO';

const resolve = file => path.resolve(__dirname, file);

const serve = (spath, cache) =>
  express.static(resolve(spath), {
    maxAge: 60 * 60 * 24 * 30,
  });

app.use(express.static(path.join(__dirname, '/clientStatic/')));
app.use('/clientStatic/', serve('./dist/clientStatic', true));

// app.use((req, res, next) => {
//   res.cookie('_e', 'PRO');
//   next();
// });

app.get('/client/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/clientStatic/', 'index.html'));
});

app.listen(7878, () => {
  console.log('Server is running at http://localhost:7878');
});
