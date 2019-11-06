const express = require('express');
const path = require('path');
const app = express();

// const resolve = file => path.resolve(__dirname, file);

// const serve = (spath, cache) =>
//   express.static(resolve(spath), {
//     maxAge: 60 * 60 * 24 * 30,
//   });

// app.use(express.static(path.join(__dirname, '/static/')));
// app.use('/static/', serve('./dist/static', true));

// // app.engine('html', engines.lodash);
// // app.engine('ejs', engines.ejs);
// app.set('views', path.resolve(__dirname, './dist/'));
// app.set('view engine', 'html');

app.get('/client/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/dist/clientStatic/', 'index.html'));
});

// app.get('/client/*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/dist/clientStatic/', 'index.html'));
// });

app.listen(7878, () => {
  console.log('Server is running at http://localhost:7878');
});
