"use strict";

const mysql = require('mysql');
var MongoClient = require('mongodb').MongoClient,format = require('util').format;
let connectionPool = mysql.createPool({
  connectionLimit : process.env.sqlPOOL_LIMIT || 10,
  host            : process.env.sqlHOST,
  user            : process.env.sqlUSER || "root",
  password        : process.env.sqlPASS || "",
  database        : process.env.sqlDB || "kdb-test",
  socketPath      : process.env.sqlSOCKETPATH || "/opt/lampp/var/mysql/mysql.sock"
})

/**
 * Perform a DB query but use a Promise instead of function callback
 * @param  {String}     query   The mysql query to run
 * @param  {Array}      params  The params you need to use in the above query. Don't pass if you're using pre-escaped values
 * @return {Promise}            The promise will reject if a connection wasn't acquired or your query failed. It will resolve if the query was successful.
 */

MongoClient.connect('mongodb://127.0.0.1:27017/kdb-test',function(err,db){
  if(err){
    throw err;
  } else{
    console.log("connected");
  }
  db.close();
});
module.exports = {
  query: (query, params) => new Promise((resolve, reject) => {
    connectionPool.getConnection((err, connection) => {
      if (err)
        return reject(err)

      connection.query(query, params || [], (err, retval) => {
        if (err) {
          connection.release()
          return reject(err)
        }

        resolve(retval)
        connection.release()
      })
    })
  })
}
