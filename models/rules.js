"use strict";

const Model = require('./model');
const fs = require('fs');
const xmlParser = require('xml2json');
const request = require('request');
const SES = require('./../config/ses_config');

class Rules extends Model {
  static addRule(Rbody) {
      try {
          console.log("happy coding"+Rbody.rule)
          // var myObjString = JSON.stringify(Rbody);
          var ruleFlag = Rbody.rule === true ? 1 : 0;
          return db.query("INSERT INTO `rules` " +
          " (`rule`) " +
          " VALUES ('"+ruleFlag+"')");
          console.log("done");
      }
      catch(err)
      {
           console.log(err);
      }
  }
  //
  // static updateScheduleList(Rbody) {
  //     try {
  //         console.log("happy coding")
  //         var RbodyData = JSON.stringify(Rbody.data);
  //         console.log(RbodyData);
  //         return db.query("UPDATE `roaster` SET  `data` = '"+RbodyData+"' WHERE `id`= '"+Rbody.id+"'")
  //     }
  //     catch(err)
  //     {
  //          console.log(err);
  //     }
  // }
  //
  // static deleteSchedule(Rbody) {
  //     try {
  //         var RbodyData = JSON.stringify(Rbody.data);
  //         console.log(RbodyData);
  //         return db.query("DELETE FROM `roaster` WHERE `id`= '"+Rbody.id+"'");
  //     }
  //     catch(err)
  //     {
  //          console.log(err);
  //     }
  // }
  //
  // static getScheduleList()
  // {
  //     try {
  //        return db.query("SELECT * FROM `roaster`")
  //     }
  //     catch(err)
  //     {
  //          console.log(err);
  //     }
  // }

}

module.exports = Rules;
