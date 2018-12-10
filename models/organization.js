"use strict";

const Model = require('./model');

class Organization extends Model {

    static getCompanyList (accId) {
      return db.query("SELECT `company_profile`.`id` AS `companyId`, `orgName`, `regAddress`,`corporateAddress`,`setDefault`, `hq`, `gstinNumber`, `panDetails`, `iecCode`,`company_profile`.`dateReg` AS `companyReg` FROM `company_profile` LEFT JOIN `users` ON `users`.`id` = `company_profile`.`userId` WHERE `users`.`accountName` = '"+accId+"' AND `active`='1'")
      .then(result => {
          let contant = result.map(i => new Model(i));
          return contant;
      })
    }

    static fetchCompanyDetails(accName) {
      return db.query("SELECT `users`.`id` AS `userid`, `dbName` FROM `users` "+
                      "LEFT JOIN `company_profile` ON `company_profile`.`userId` = `users`.`id` WHERE `users`.`accountName`= '"+accName+"'")
      .then(result => {
        let contant = result.map(i => new Model(i));
        return contant;
      })
    }

    static fetchUserId(accName) {
      return db.query("SELECT `id` FROM `users` WHERE `accountName`= '"+accName+"'")
      .then(result => {
          let contant = result.map(i => new Model(i));
          return contant;
      })
    }

    static addNewCompany (body,userId,dbName,ip) {
      try {
          if (ip.substr(0, 7) == "::ffff:") {
          ip = ip.substr(7); }
          return db.query("INSERT INTO `company_profile` " +
            " (`userId`,`dbName`,`orgName`, `regAddress`, `corporateAddress`, `gstinNumber`, `panDetails`, `iecCode`, `setDefault`, `hq`, `ip`) " +
            " VALUES ('" +userId+ "','"+dbName+"','"+body.orgName+"', '"+JSON.stringify(body.regAddress)+"', '"+JSON.stringify(body.corpAddress)+"', '"+body.gstinNumber+"', '"+body.panDetails+"', '"+body.iecCode+"', '"+body.setDefault+"', '"+body.hq+"', '"+ip+"') ")
      } catch(err) {
          console.log(err);
      }
    }

    static getUserId(id) {
        return db.query("SELECT `userId` FROM `company_profile` "+
                        "WHERE `id` = '"+id+"'")
        .then(result => {
          let contant = result.map(i => new Model(i));
          return contant;
        })
    }

    static setOrganizationFlag(id,columnVal) {
      try {
        return db.query("UPDATE `company_profile` SET "+columnVal+" = '1' WHERE `id` = '"+id+"'");
      } 
      catch(err) 
      {
        console.log(err);
      }
    }

    static setOtherOrganizationFlag(userId,id,columnVal) {
      try 
      {
        return db.query("UPDATE `company_profile` SET "+columnVal+" = '0' WHERE `id` != '"+id+"' AND `userId` = '"+userId+"'");
      } 
      catch(err) 
      {
        console.log(err);
      }
    }

    static getEntityList (accId) {
      return db.query("SELECT `entity`.`id` AS `entityId`, `entity`.`name` AS `entityName`, `type`,`address`,`orgName`, `addDate` FROM `entity` "+
                      "LEFT JOIN `users` ON `users`.`id` = `entity`.`userId` "+
                      "LEFT JOIN `company_profile` ON `company_profile`.`id` = `entity`.`companyId` "+
                      "WHERE `users`.`accountName` = '"+accId+"'")
      .then(result => {
          let contant = result.map(i => new Model(i));
          return contant;
      })
    }

    static addNewEntity (body,id,ip) {
      try {
          if (ip.substr(0, 7) == "::ffff:") {
          ip = ip.substr(7); }
          return db.query("INSERT INTO `entity` " +
            " (`userId`, `companyId`, `name`, `type`, `address`, `ip`) " +
            " VALUES ('" +id+ "','"+body.companyId+"','"+body.entityName+"', '"+body.type+"', '"+body.location+"','"+ip+"') ")
      } catch(err) {
          console.log(err);
      }
    }

    static getDepartmentList (accId) {
      return db.query("SELECT `department`.`id` AS `departmentId`, `department`.`name` AS `departmentName`, `entity`.`name` AS `entityName`, `orgName` FROM `department` "+
                      "LEFT JOIN `users` ON `users`.`id` = `department`.`userId` "+
                      "LEFT JOIN `company_profile` ON `company_profile`.`id` = `department`.`companyId` "+
                      "LEFT JOIN `entity` ON `entity`.`id` = `department`.`entityId` "+
                      "WHERE `users`.`accountName` = '"+accId+"' AND `subDept` = '0'")
      .then(result => {
          let contant = result.map(i => new Model(i));
          return contant;
      })
    }

    static addNewDepartment (body,id) {
      try {
          return db.query("INSERT INTO `department` " +
            " (`userId`, `companyId`, `entityId`, `name`, `subDept`) " +
            " VALUES ('" +id+ "','"+body.companyId+"','"+body.entityId+"', '"+body.name+"', '"+body.subDept+"') ")
      } catch(err) {
          console.log(err);
      }
    }

    static setActiveCompany(id) {
      try {
          return db.query("UPDATE `company_profile` SET `active` = '0' WHERE `id` = '"+id+"'");
      } catch(err) {
          console.log(err);
      }
    }
}

module.exports = Organization;
