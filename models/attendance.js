"use strict";

const Model = require('./model');
const fs = require('fs');
const xmlParser = require('xml2json');
const request = require('request');
const SES = require('./../config/ses_config');

class Rules extends Model {
  static addAttendance(attendanceBody) {
      try {
          var ruleFlag = attendanceBody.ruleFlag === true ? 1 : 0;
          return db.query("INSERT INTO `attendance` " +
          " (`subuserId` , `attendanceDate` , `punchIn` , `punchOut`) " +
          " VALUES ('"+attendanceBody.subuserId+"','"+attendanceBody.attendanceDate+"','"+attendanceBody.punchIn+"','"+attendanceBody.punchOut+"')");
          console.log("done");
      }
      catch(err) {
          console.log(err);
      }
  }

  static getAttendance(attendanceBody) {
      try {
          return db.query("SELECT users_profile.email , users_profile.id , users_profile.name , users_profile.phone , users_profile.Department,"+
          "users_profile.designation , users_profile.employmentId ,users_profile.scheduleId,users_profile.shiftId, users_profile.scheduleId ,MIN(punchIn) as punchIn,MAX(punchOut) as punchOut, SEC_TO_TIME(SUM(TIME_TO_SEC(punchOut) -TIME_TO_SEC(punchIn)))"+
          "AS working_hours FROM users_profile LEFT JOIN attendance ON users_profile.id=attendance.subuserId GROUP BY id");
      } catch(err) {
          console.log(err);
      }
  }
  static getAttendanceListByDaily(Attenbody) {
      try {
          return db.query("SELECT users_profile.name , users_profile.Department,"+
          "users_profile.designation ,MIN(punchIn) as punchIn,MAX(punchOut) as punchOut, SEC_TO_TIME(SUM(TIME_TO_SEC(punchOut) -TIME_TO_SEC(punchIn)))"+
          "AS working_hours FROM users_profile LEFT JOIN attendance ON (users_profile.id=attendance.subuserId AND (STRCMP(attendance.attendanceDate,'"+Attenbody+"')=0)) GROUP BY id")
          .then(result => {
              let contant = result.map(i => new Model(i));
              return contant;
          })
      } catch(err) {
          console.log(err);
      }
  }
  static getAttendanceListByWeekly(Attenbody) {
      try {
          var current_date = Attenbody;
          var date = new Date();
          date.setDate(date.getDate() + 7);
          var next_date = date.toISOString().split('T')[0];
          return db.query("SELECT users_profile.name,COUNT(DISTINCT(attendance.attendanceDate)) as totalnodays "+
          "FROM users_profile LEFT JOIN attendance ON (users_profile.id=attendance.subuserId AND (attendance.attendanceDate >='"+current_date+"' AND attendance.attendanceDate <='"+next_date+"')) GROUP BY id")
          .then(result => {
              let contant = result.map(i => new Model(i));
              return contant;
          })
      } catch(err) {
          console.log(err);
      }
  }
  static getAttendanceListByMonthly() {
      try {
          var date_month = new Date().getMonth();
          date_month = date_month+1;
          var date_year = new Date().getFullYear();
          var first_date = date_year+"-"+date_month+"-01";
          var last_day_date = new Date(date_year, date_month, 0).getDate();
          var last_date =  date_year+"-"+date_month+"-"+last_day_date;
          return db.query("SELECT users_profile.name,COUNT(DISTINCT(attendance.attendanceDate)) as totalnodays "+
          "FROM users_profile LEFT JOIN attendance ON (users_profile.id=attendance.subuserId AND (attendance.attendanceDate >='"+first_date+"' AND attendance.attendanceDate <='"+last_date+"')) GROUP BY id")
          .then(result => {
              let contant = result.map(i => new Model(i));
              return contant;
          })
      } catch(err) {
          console.log(err);
      }
  }
}

module.exports = Rules;
