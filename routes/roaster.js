const router = (require('express')).Router()
const Roaster = require('../models').Roaster
const verifyToken = require('../config/jwt')
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const config = require("../config/config.json");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
var moment = require('moment');

router.get('/schedules_list', function(req, res, next){
    try {
        Roaster.getScheduleList()
        .then(result => {
            res.format({
                    "application/json": () => {
                        res.send(result)
                    },
                    "default": () => {
                        let locals = Object.assign({}, res.locals, {"scheduleList": result})
                        res.render("scheduleList", result)
                    }
                })
            })
            .catch(err => {
                err.status = 500
                next(err)
             })
    } catch(err) {
        console.log(err);
    }
});


router.get('/roster_report/:reportType/:id', function(req, res, next){
    try {
        if(req.params.id == 1) {
        Roaster.getSubUsersList(req.params.reportType,req.params.id)
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
        else{
            console.log("something is wrong")
        }
    } catch(err) {
        console.log(err);
    }
});


router.post('/add_schedule', async(function(req, res, next){
    try {
        var tStart = moment(req.body.shift_start, 'h:mm A');
        var tEnd = moment(req.body.shift_end, 'h:mm A');
        req.body.shift_start = tStart.hours()+":"+tStart.minutes();
        req.body.shift_end = tEnd.hours()+":"+tEnd.minutes();
        let result = await(Roaster.setScheduleData(req.body));
        if(result) {
          res.send({"status" : 200, "message":"successfully data inserted"});
        }
    } catch(err){
        console.log(err);
    }
}));



module.exports = router;
