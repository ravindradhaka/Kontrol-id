"use strict";

const Model = require('./model');
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
const transporter =(require('../config/ses_config'))
var fs = require('fs');

class Users extends Model {

    static getSubusersList(accId,userName) {
        return db.query("SELECT `users_profile`.`name` AS `name`,`users_profile`.`designation` AS `designation`,`users_profile`.`email` AS `email`,`users_profile`.`phone` AS `phone` ,`nationality` AS `nationality`,`image` AS `image`,`orgName` AS `orgName`,`dateOfBirth` AS `dob`,`gender` AS `gender`,`mStatus` AS `mStatus`,`bloodGrp` AS `bloodGrp` ,`religion` AS `religion`,`qualification` AS `qualification`,`employementType` AS `employementType`,`localAddress` AS `localAddress`,`permanentAddress` AS `permanentAddress` FROM `users_profile` "+
                        "LEFT JOIN `subusers_data` ON `subusers_data`.`id` = `users_profile`.`id`"+
                        "INNER JOIN `company_profile` ON `users_profile`.`companyId`=`company_profile`.`id`"+
                        "INNER JOIN `users` ON `users`.`id`=`company_profile`.`userId` WHERE `users_profile`.`userName`='"+userName+"' AND `users`.`accountName`='"+accId+"'")
        .then(result => {
            let contant = result.map(i => new Model(i));
            return contant;
        })
    }

    static setSubusersData(id,nationality,dob,gender,maritalStatus,bloodGroup,religion,qualification,employmentType,localAddress,permanentAddress)
    {
        return db.query("INSERT INTO `subusers_data`(`id`,`nationality`, `dateOfBirth`, `gender`, `mStatus`, `bloodGrp`,`religion`, `qualification`,`employementType`,`localAddress`,`permanentAddress`)"+
        "VALUES ('" +id+ "','"+nationality+"','"+dob+"',  '"+gender+"','"+maritalStatus+"','"+bloodGroup+"','"+religion+"','"+qualification+"','"+employmentType+"','"+localAddress+"','"+permanentAddress+"')" +
        "ON DUPLICATE KEY UPDATE `id`='"+id+"',`nationality`='"+nationality+"',`dateOfBirth`='"+dob+"',`gender`='"+gender+"',`mStatus`='"+maritalStatus+"',`bloodGrp`='"+bloodGroup+"',`religion`='"+religion+"',`qualification`='"+qualification+"',`employementType`='"+employmentType+"',`localAddress`='"+localAddress+"',`permanentAddress`='"+permanentAddress+"'")
    }

    static setUsers(name,userName)
    {
        return db.query("UPDATE `users_profile` SET `name` = '"+name+"' WHERE `userName`= '"+userName+"'")
    }

    static getLastId(id,userName)
    {
        return db.query("SELECT `id` FROM `users_profile` WHERE `userName`='"+userName+"' AND `id`='"+id+"' ")
    }

    static getUsersList(accName) {
        return db.query("SELECT `users_profile`.`id` AS `profileId`, `orgName`,`users_profile`.`name` AS `profileName`, `users_profile`.`userName` AS `profileUserName` FROM `users_profile` "+
                        "LEFT JOIN `company_profile` ON `company_profile`.`id` = `users_profile`.`companyId` "+
                        "LEFT JOIN `users` ON `users`.`id` = `company_profile`.`userId` WHERE `accountName`= '"+accName+"'")
        .then(result => {
            let contant = result.map(i => new Model(i));
            return contant;
        })
    }

    static fetchEmployeeList() {
        return db.query("SELECT * FROM `users`")
    }

    static setUsersImage(userName,image)
    {
        console.log(userName)
        return db.query("UPDATE `users_profile` SET `image`='"+image+"' WHERE `userName`='"+userName+"'")
    }

    static setUserAccount(tName,tCompanyId,tuserName,tEmail,tPhone,tPassword) {
        try {
            return db.query("INSERT INTO `users_profile` " +
            " (`name`, `companyId`, `userName`,  `email`,`phone`,`password`) " +
            " VALUES ('" +tName+ "','"+tCompanyId+"','"+tuserName+"',  '"+tEmail+"','"+tPhone+"','"+tPassword+"')")
        }
        catch(err)
        {
             console.log(err);
        }
    }

    static sendEmail(tName,tEmail,tPassword)
    {
        return new Promise((resolve,reject)=>{
            fs.readshift_start!=null & shift_end!=nullFile('./static/email.html','utf8',(err,data)=>{
            if(err)
            {
                reject(err);
            }
            else
            {
                var i= data.toString().replace("User_id",tName).replace("password",tPassword).replace("First_Name",tName);
                transporter.sendMail({
                    from: 'noreply@ktrl.email',
                    to: tEmail,
                    subject: 'User Id and Password',
                    html : i,
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
}

module.exports = Users;
