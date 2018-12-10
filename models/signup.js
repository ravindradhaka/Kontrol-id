"use strict";
const Model = require('./model');
const fs = require('fs');
const xmlParser = require('xml2json');
const request = require('request');
const SES = require('./../config/ses_config');

class Signup extends Model {
    static getCountryList () {
      return new Promise((resolve,reject)=>{
          let reader = fs.readFile('./static/country_code.xml','utf8',(err,data)=>{
            if(err)
            {
                reject(err);
            }
            else
            {
              resolve(xmlParser.toJson(data));
            }
          })
      });
    }

    static setSignUp (userId,body,ip) {
      try {
          // we're returning this directly since db.query in this instance returns a Promise
          if (ip.substr(0, 7) == "::ffff:") {
          ip = ip.substr(7); }
          return db.query("INSERT INTO `company_profile` " +
            " (`userId`,`dbName`,`orgName`, `regAddress`, `corporateAddress`, `gstinNumber`, `panDetails`, `iecCode`, `setDefault`, `hq`, `ip`) " +
            " VALUES ('" +userId+ "','"+body.kidDB+"','"+body.orgName+"', '"+JSON.stringify(body.regAddress)+"', '"+JSON.stringify(body.corpAddress)+"', '"+body.gstinNumber+"', '"+body.panDetails+"', '"+body.iecCode+"', '"+body.setDefault+"', '"+body.hq+"', '"+ip+"') ")
      }
      catch(err)
      {
        console.log(err);
      }
    }

    static setUserSignUp (body,hmac,salt) {
      try {
          // we're returning this directly since db.query in this instance returns a Promise
          let name = (body.name.midName.length > 0) ? body.name.firstName+" "+body.name.midName+" "+body.name.lastName : body.name.firstName+" "+body.name.lastName;
          return db.query("INSERT INTO `users` " +
            " (`accountName`, `userName`, `name`, `email`, `mobileNumber`, `password`, `salt`, `designation`) " +
            " VALUES ('" +body.kidAccName+ "', '" +body.kidUsername+ "', '" +name+ "', '"+body.email+"', '" +JSON.stringify(body.mobile)+ "', '"+hmac+"', '"+salt+"','" +body.designation+ "') ")
      }
      catch(err) {
        console.log(err);
      }
    }

    static SendOtpEmail(email,name,otp)
    {
      return new Promise((resolve,reject)=>{
        fs.readFile('./static/otp-mail.html','utf8',(err,data)=>{
        if(err)
        {
          reject(err);
        }
        else
        {
          data = data.replace("{first_name}",name);
          data = data.replace("{OTP}", otp);
          SES.sendMail({
            from: 'noreply@ktrl.email',
            to: email,
            subject: "OTP for Registration",
            html: data
          },function(err,data){
              if(err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
        }
        });
      });
    }

    static SendSignupEmail(kidAccName,email,userName)
    {
      return new Promise((resolve,reject)=>{
        fs.readFile('./static/signupemail.html','utf8',(err,data)=>{
        if(err)
        {
          reject(err);
        }
        else
        {
          data=data.replace("First_Name",userName)
          data = data.replace("User_id","admin");
          data = data.replace("kid",kidAccName);
          data = data.replace("{KID-ID}",kidAccName)
          SES.sendMail({
            from: 'noreply@ktrl.email',
            to: email,
            subject: "User Details",
            html: data
          },function(err,data){
              if(err) {
                reject(err);
              } else {
                resolve(data);
              }
          });
        }
        });
      });
    }

    static SendOtpMobile(mobile,otp)
    {
      return new Promise((resolve,reject)=>{
        request.post({
          headers: {'content-type' : 'application/x-www-form-urlencoded'},
          url:     'https://kcreativ:c065ebb59c58a140c97f85f26b0415fe4d539bae@twilix.exotel.in/v1/Accounts/kcreativ/Sms/send',
          form:    {'From' : '01139587412', 'To' : mobile, 'Body' : 'This is a test message being sent using Exotel with a (OTP) and ('+otp+'). If this is being abused, report to 08088919888'}
        },
        function (error, response, body) {
          if(error)
          {
              reject(error);
          } else {
              resolve(response.statusCode);
          }
        });
      });
    }

    static setOtpData (id,otphash) {
      try {
          // we're returning this directly since db.query in this instance returns a Promise
          return db.query("INSERT INTO `otp_record` " +
            " (`id`, `otp`) " +
            " VALUES ('" +id+ "', '" +otphash+ "') ")
      }
      catch(err)
      {
        console.log(err);
      }
    }

    static getMail(email)
    {
      return db.query("SELECT `email` FROM `users` WHERE `email`='"+email+"' ")
    }

    static getNumber(num)
    {
      return db.query("SELECT `mobileNumber` FROM `users` WHERE `mobileNumber`='"+num+"' ")
    }

    static getCompanyDetails () {
        // we're returning this directly since db.query in this instance returns a Promise
        return db.query("SELECT `accountName` FROM `users`")
        .then(result => {
            let contant = result.map(i => new Model(i))
            return contant
        })
    }
}

module.exports = Signup
