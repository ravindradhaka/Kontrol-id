"use strict";

const Model = require('./model');
const requestIp = require('request-ip')

class Login extends Model {

    static getUserDetails (accName) {
      // we're returning this directly since db.query in this instance returns a Promise
      return db.query("SELECT `id`,`userName`,`name`,`password`,`salt`,`email` FROM `users` WHERE `accountName` = '"+accName+"'")
      .then(result => {
          let contant = result.map(i => new Model(i))
          return contant
      })
    }

    static setOtpData (id,otphash) {
        try {
            // we're returning this directly since db.query in this instance returns a Promise
            return db.query("INSERT INTO `otp_record` " +
              " (`id`, `otp`) " +
              " VALUES ('" +id+ "', '" +otphash+ "') ")
        } 
        catch(err) {
            console.log(err);
        }
    }   
}

module.exports = Login
