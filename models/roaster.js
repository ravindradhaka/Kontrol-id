"use strict";

const Model = require('./model');
const fs = require('fs');
const xmlParser = require('xml2json');
const request = require('request');
const SES = require('./../config/ses_config');

class Roaster extends Model {
  static setScheduleData(Rbody) {
      try {
          console.log(Rbody.name);
          return db.query("INSERT INTO `schedule` " +
          " (`name`,`type`,`shift_start`,`shift_end`) " +
          " VALUES ('"+Rbody.name+"','"+Rbody.type+"','"+Rbody.shift_start+"','"+Rbody.shift_end+"')")
          console.log("done");
      }
      catch(err)
      {
           console.log(err);
      }
  }
  static getSubUsersList() {
      try {
          return db.query("SELECT users_profile.name ,schedule.name AS shift_name ,schedule.shift_start,schedule.shift_end FROM users_profile LEFT JOIN schedule ON users_profile.scheduleId=schedule.id")
          .then(result => {
              let contant = result.map(i => new Model(i));
              return contant;
          })
      } catch(err) {
          console.log(err);
      }
  }
  static setshiftData(shiftbody) {
      console.log(shiftbody.scheduleId);
      try {
            if(shiftbody.checked) {
                return db.query("INSERT INTO `roaster_timings` (`scheduleId` , `shift_start` , `shift_end` )" +
                " VALUES ('"+shiftbody.scheduleId+"','"+shiftbody.shift_start+"','"+shiftbody.shift_end+"')")
            } else {
                return db.query("DELETE FROM `roaster_timings` WHERE (`shift_start`= '"+shiftbody.shift_start+"' AND `shift_end`= '"+shiftbody.shift_end+"') AND (`scheduleId`= '"+shiftbody.scheduleId+"') ");
            }
      }
      catch(err)
      {
           console.log(err);
      }
  }

  static updateScheduleList(Rbody) {
      try {
          console.log("happy coding")
          var RbodyData = JSON.stringify(Rbody.data);
          console.log(RbodyData);
          return db.query("UPDATE `roaster` SET  `data` = '"+RbodyData+"' WHERE `id`= '"+Rbody.id+"'")
      }
      catch(err)
      {
           console.log(err);
      }
  }

  static deleteSchedule(Rbody) {
      try {
          var RbodyData = JSON.stringify(Rbody.data);
          console.log(RbodyData);
          return db.query("DELETE FROM `roaster` WHERE `id`= '"+Rbody.id+"'");
      }
      catch(err)
      {
           console.log(err);
      }
  }

  static getScheduleList()
  {
      console.log("getScheduleList")
      try {
         return db.query("SELECT * FROM `schedule`")
         .then(result => {
             let contant = result.map(i => new Model(i));
             return contant;
         })
      }
      catch(err)
      {
           console.log(err);
      }
  }

  static getShiftTimings(scheduleBody) {
      try {
           return db.query("SELECT * FROM `roaster_timings` WHERE `id`='"+scheduleBody.shiftId+"' AND `scheduleId`='"+scheduleBody.scheduleId+"' ");
      }
      catch(err)
      {
           console.log(err);
      }
  }
}

module.exports = Roaster;
