// const { Pool } = require('pg-promise');

// const connectionString = process.env.DATABASE_URL;
// const pool = new Pool({connectionString: connectionString});

// module.exports.pool = pool;

const pgp = require('pg-promise')({});
const cn = process.env.DATABASE_URL;

const db = pgp(cn);

module.exports = dbconnect;