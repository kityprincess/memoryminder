const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

 express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/vip/:idVip', getVIP)
  .get('/', (req, res) => res.render('pages/index'))

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  // .get('/rates', function(req, res) {
  // 		res.render('pages/rates', {
  // 			weight: req.query.weight,
  // 			mailType: req.query.mailType,
  // 			rate: calculateRate(req, res)
  // 		})
  // 	})

  function getVIP(req, res) {
  	console.log('getting vip');

  	var idVip = req.params.idVip;
  	console.log('retrieving VIP ID: ', idVip);

  	getVipFromDb(idVip, function(error, result) {
      console.log('Back from the getVipFrom ID function with results: ', result);

      if (error || result == null || result.length !=1) {
        res.status(500).json({success: false, data: error});
      } else {
        res.json(result[0]);
      }
  	});
  }
 
  function getVipFromDb(idVip, callback) {
  	console.log('getVipFromDb called with ID: ', idVip);

  	var sql = 'SELECT id, vip_user_id, first_name, middle_name, last_name, dob, wedding_anniv FROM public.vip WHERE id = $1::int';

  	var params = [idVip];

  	pool.query(sql, params, function(error, result) {
  		if (error) {
  			console.log('A DB error occured');
  			console.log(error);
  			callback(error, null);
  		}

  		console.log('Found DB result: ' + JSON.stringify(result.rows));

  		callback(null, result.rows);
  	});
  }