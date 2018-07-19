require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;
var session = require('express-session');

const getdata = require('./models/getdata.js');
const writedata = require('./models/writedata.js');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

 express()
 .use(session({
    store: new (require('connect-pg-simple')(session))(),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  }))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/vip/:userId', getdata.getVIP)
  .post('/userlogin', urlencodedParser, getdata.getUser)
  .post('/newuser', urlencodedParser, writedata.newUser)
  .get('/addvip', (req, res) => res.render('pages/addvip'))

  .listen(PORT, () => console.log(`Listening on ${ PORT }`));