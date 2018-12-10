const router = (require('express')).Router()
const Attendance = require('../models').Attendance
const Roaster = require('../models').Roaster
const verifyToken = require('../config/jwt')
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const config = require("../config/config.json");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
var moment = require('moment');

router.post('/attendance', async(function(req, res, next){
    try {
        console.log(req.body);
        let result = await(Attendance.addAttendance(req.body));
        if(result) {
          res.send({"status" : 200, "message":"data inserted"});

        }
    } catch(err){
        console.log(err);
    }
}));

router.post('/subusers_attendance',verifyToken, async(function(req, res, next){
  jwt.verify(req.token,'secretkey',(err,authData) =>
  {
      if(err) {
          res.send({"status" : 600, "message":"forbidden"});
      }
      try {
          console.log(req.body);
          let result = await(Attendance.getAttendance(req.body));
          res.send({"status" : 200, "message":result});
      } catch(err){
          console.log(err);
      }
  });
}));

router.get('/attendance_report/:date/:id', function(req,res,next) {
    if(req.params.id == 1 && req.params.date ) {
         Attendance.getAttendanceListByDaily(req.params.date)
         .then(result => {
            res.format({
                    "application/json": () => {
                        res.send(result)
                    },
                    "default": () => {
                        let locals = Object.assign({}, res.locals, {"getSubUsersList": result})
                        res.render("getSubUsersList", result)
                    }
                })
            })
            .catch(err => {
                err.status = 500
                next(err)
             })

     } else if(req.params.id == 2 && req.params.date) {
         Attendance.getAttendanceListByWeekly(req.params.date)
         .then(result => {
             res.format({
                     "application/json": () => {
                         res.send(result)
                     },
                     "default": () => {
                         let locals = Object.assign({}, res.locals, {"getSubUsersList": result})
                         res.render("getSubUsersList", result)
                     }
                 })
             })
             .catch(err => {
                 err.status = 500
                 next(err)
              })

     }
})

module.exports = router;
