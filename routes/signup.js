const router = (require('express')).Router()
const verifyToken = require('../config/jwt')
const jwt = require('jsonwebtoken');
const Signup = require('../models').Signup
var crypto = require('crypto');
const config = require("../config/config.json");
const async = require('asyncawait/async');
const await = require('asyncawait/await');

router.get('/country_list',verifyToken,function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        Signup.getCountryList()
        .then(result => {
            res.format({
                "application/json": () => {
                    res.send(result)
                },
                "default": () => {
                    let locals = Object.assign({}, res.locals, {"signup": result})
                    res.render("signup", result)
                }
            })
        })
        .catch(err => {
            err.status = 500
            next(err)
        })
    })
})


router.post('/user_signup', async(function(req, res, next) {
  console.log(req.body);
    try {
        let body = JSON.parse(Object.keys(req.body)[0]);
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let key = crypto.createHash('sha256').update((new Date().valueOf())+""+body.kidAccName).digest('hex');
        const hmac = crypto.createHash('sha512').update(body.password+""+key).digest('hex');
        let ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let resUser = await(Signup.setUserSignUp(body,hmac,key));
        if(resUser.affectedRows > 0) {
            let resCompany = await(Signup.setSignUp(resUser.insertId,body,ip));
            if(resCompany.affectedRows > 0) {
                let mail= await(Signup.SendSignupEmail(body.kidAccName,body.email,body.userName));
                if(mail) {
                    res.send({"status" : 200, "message":"success"})
                }
                else{
                    res.send({"status" : 420, "message":"failed"})
                }
            }
            else
            {
                res.send({"status" : 420, "message":"failed to insert"})
            }
        }
    }
    catch(err)
    {
      console.log(err);
    }
}))

router.post('/send_mail' ,async(function(req, res, next) {
    try {
        let body = ((req.headers['user-agent'].match(/okhttp/i)).length > 0) ? req.body : JSON.parse(Object.keys(req.body)[0]);
        console.log(body)
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let today = new Date();
        let otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp)
        if(body.name.firstName.length > 0 && body.name.lastName.length > 0 && re.test(body.email) === true && /^[0-9]*$/.test(body.mobile.num) === true && /^[0-9a-zA-Z]*$/.test(body.kidAccName) ===
        true && body.kidAccName.length < 11 && body.kidAccName.length > 4 && body.designation.length > 0 && body.orgName.length > 0 && body.cinNumber.length > 0 &&
        body.regAddress.buildingName.length > 0 && body.regAddress.streetName.length > 0 && body.regAddress.city.length > 0 && body.regAddress.state.length > 0 &&
        body.regAddress.pin.length > 0 && body.regAddress.country.length > 0 && body.corpAddress.buildingName.length > 0 && body.corpAddress.streetName.length > 0 &&
        body.corpAddress.city.length > 0 && body.corpAddress.state.length > 0 && body.corpAddress.pin.length > 0 && body.corpAddress.country.length > 0 &&
        body.gstinNumber.length > 0)
        {
            let emailCheck= await(Signup.getMail(body.email))
            let numCheck = await(Signup.getNumber(body.mobile.num))
            if(emailCheck.length == 0 )
            {
                if(numCheck.length > 0 )
                {
                    res.send({"status" : 420, "message":"Phone Number already Exist"})
                }
                else
                {
                    let todayMob = new Date();
                    let otpMob = Math.floor(100000 + Math.random() * 900000);
                    let id = crypto.createHash('md5').update(otp+""+today.toISOString()+""+body.name.firstName).digest('hex');
                    let idMob = crypto.createHash('md5').update(otpMob+""+todayMob.toISOString()+""+body.name.lastName).digest('hex');
                    let otphash = crypto.createHmac('md5', 'zentrum*!@#$Technology').update(otp.toString()).digest('hex');
                    let otphashMob = crypto.createHmac('md5', 'zentrum*!@#$Technology').update(otpMob.toString()).digest('hex');
                    let otpData = await(Signup.setOtpData(id,otphash));
                    let otpDataMob = await(Signup.setOtpData(idMob,otphashMob));
                    if(otpData.affectedRows > 0 && otpDataMob.affectedRows > 0) {
                        let sendMail = await(Signup.SendOtpEmail(body.email,body.name.firstName,otp));
                        let sendOtpMob = 200;
                        if(sendMail && sendOtpMob == 200) {
                            res.send({"otp":otphash,"id":id,"otpMob":otphashMob,"idMob":idMob,"status":200})
                        }
                        else
                        {
                            res.send({"status" : 420, "message":"Error in sending OTP"});
                        }
                    }else
                    {
                        res.send({"status" : 420, "message":"Something went wrong"});
                    }
                }
            }
            else
            {
                res.send({"status" : 420, "message":"Email ID Already Exist"})
            }
        }
        else
        {
            res.send({"status" : 420, "message":"Please check all fields with *"});
        }
    }
    catch(err) {
        console.log(err);
    }
}))

router.post('/resend_otp',verifyToken, async(function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 420, "message":"failed to insert"});
        }
        try {
            let body = JSON.parse(Object.keys(req.body)[0]);
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let today = new Date();
            let otp = Math.floor(100000 + Math.random() * 900000);
            if(body.name.firstName.length > 0 && body.name.lastName.length > 0 && re.test(body.email) === true && /^[0-9]*$/.test(body.mobile.num) === true) {
                let todayMob = new Date();
                let otpMob = Math.floor(100000 + Math.random() * 900000);

                let id = crypto.createHash('md5').update(otp+""+today.toISOString()+""+body.name.firstName).digest('hex');
                let idMob = crypto.createHash('md5').update(otpMob+""+todayMob.toISOString()+""+body.name.lastName).digest('hex');

                let otphash = crypto.createHmac('md5', 'zentrum*!@#$Technology').update(otp.toString()).digest('hex');
                let otphashMob = crypto.createHmac('md5', 'zentrum*!@#$Technology').update(otpMob.toString()).digest('hex');
                let otpData = await(Signup.setOtpData(id,otphash));
                let otpDataMob = await(Signup.setOtpData(idMob,otphashMob));
                if(otpData.affectedRows > 0 && otpDataMob.affectedRows > 0) {
                    let sendMail = await(Signup.SendOtpEmail(body.email,body.name.firstName,otp));
                    //let sendOtpMob = await(Signup.SendOtpMobile(body.mobile.num,otpMob));
                    let sendOtpMob = 200;
                    if(sendMail && sendOtpMob == 200) {
                        res.send({"otp":otphash,"id":id,"otpMob":otphashMob,"idMob":idMob,"status":200})
                    }
                }
            }
            else
            {
               res.send({"status" : 420, "message":"Please check all fields with *"});
            }
        }
        catch(err)
        {
            console.log(err);
        }
    })
}))

router.get('/company_details', function(req, res, next) {
    Signup.getCompanyDetails()
    .then(result => {
        console.log(result)
        console.log(req.body)
        res.format({
            "application/json": () => {
                res.send(result)
            },
            "default": () => {
                let locals = Object.assign({}, res.locals, {"signup": result})
                res.render("signup", result)
            }
        })
    })
    .catch(err =>
    {
        err.status = 500
        next(err)
    })
})

module.exports = router
