const { Pool } = require('pg-promise');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

const begin_transaction = 'begin';
const rollback_transaction = 'rollback';
const commit_transaction = 'commit';

module.exports.pool = pool;