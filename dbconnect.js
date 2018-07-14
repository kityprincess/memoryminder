const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

// allows simpler implementation for multiple db queries
// https://baudehlo.com/2014/04/28/node-js-multiple-query-transactions/
exports.waterfall = function waterfall (tasks, callback) {
    pg.dbconnect(connstring, function (err, client, done) {
        if (err) {
            return callback(err);
        }
 
        client.query(begin_transaction, function (err) {
            if (err) {
                done();
                return callback(err);
            }
             
            var wrapIterator = function (iterator) {
                return function (err) {
                    if (err) {
                        client.query(rollback_transaction, function () {
                            done();
                            callback(err);
                        });
                    }
                    else {
                        var args = Array.prototype.slice.call(arguments, 1);
                        var next = iterator.next();
                        if (next) {
                            args.unshift(client);
                            args.push(wrapIterator(next));
                        }
                        else {
                            args.unshift(client);
                            args.push(function (err, results) {
                                var args = Array.prototype.slice.call(arguments, 0);
                                if (err) {
                                    client.query(rollback_transaction, function () {
                                        done();
                                        callback(err);
                                    });
                                }
                                else {
                                    client.query(commit_transaction, function () {
                                        done();
                                        callback.apply(null, args);
                                    })
                                }
                            })
                        }
                        async.setImmediate(function () {
                            iterator.apply(null, args);
                        });
                    }
                };
            };
            wrapIterator(async.iterator(tasks))();
        });
    });
}

module.exports = pool;