const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const getdata = require('./models/getdata.js');
const writedata = require('./models/writedata.js');

 express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/vip/:idVip', getdata.getVIP)
  .post('/newuser', writedata.newUser)
  .get('/', (req, res) => res.render('pages/index'))

  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

