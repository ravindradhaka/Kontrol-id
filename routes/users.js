const router = (require('express')).Router()
const Users = require('../models').Users
const verifyToken = require('../config/jwt')
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const config = require("../config/config.json");
const async = require('asyncawait/async');
const await = require('asyncawait/await');

router.get('/subusers_data/:accId/:userName',verifyToken, function(req,res,next){
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {  
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});  
        }
        Users.getSubusersList(req.params.accId,req.params.userName)
        .then(result => {
            res.format({
                "application/json": () => {
                    res.send(result)
                },
                "default": () => {
                    let locals = Object.assign({}, res.locals, {"SubUsersList": result})
                    res.render("SubUsersList", result)
                }
            })
        })
        .catch(err => {
            err.status = 500
            next(err)
        })
    })
})

router.post('/update_subusers_data',verifyToken, async(function(req, res, next){
    jwt.verify(req.token,'secretkey',(err,authData) =>
    { 
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        try 
        {
            console.log("1")
            if(req.body.name!==null && req.body.name!=="" && req.body.userName !==null && req.body.userName!=="" && req.body.id!==null && req.body.id!=="" && req.body.nationality !==null && req.body.nationality!=="" && req.body.dob!==null && req.body.dob!==""&& req.body.gender!==null && req.body.gender!=="" && req.body.maritalStatus !==null && req.body.maritalStatus !=="" && req.body.bloodGroup !==null && req.body.bloodGroup !=="" && req.body.religion!=="" && req.body.religion !==null  && req.body.qualification!=="" && req.body.qualification !==null && req.body.employmentType!=="" && req.body.employmentType !==null && req.body.localAddress!=="" && req.body.localAddress !==null&& req.body.permanentAddress!=="" && req.body.permanentAddress !==null) 
            {  
                console.log("2")
                let result  =await(Users.setUsers(req.body.name,req.body.userName))
                if(result.affectedRows > 0 )
                {
                    console.log("3")
                    let result1 = await(Users.getLastId(req.body.id,req.body.userName))
                    lastid=req.body.id
                    let result2 = await(Users.setSubusersData(req.body.id,req.body.nationality,req.body.dob,req.body.gender,req.body.maritalStatus,req.body.bloodGroup,
                    req.body.religion,req.body.qualification,req.body.employmentType,req.body.localAddress,req.body.permanentAddress));
                    subusersId=req.body.id
                    if(lastid == subusersId)
                    {
                        console.log("5")
                        if(result2.affectedRows > 0 )
                        {
                            console.log("6")
                            res.send({"status" : 200, "message":"Inserted"})
                        }
                        else {
                            res.send({"status" : 420, "message":"failed to insert"})
                        }
                    }
                    else
                    {
                        res.send({"status" : 420, "message":"Failed"})
                    }
                   
                }
                else {
                    res.send({"status" : 420, "message":"failed to insert"})
                }
            }
            else{
                res.send({"status" : 420, "message":"failed to insert"})
            }
                   
        }
        catch(err) 
        {
            console.log(err);
        }        
    })
}))

router.get('/users_list/:accId',verifyToken, function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    { 
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        Users.getUsersList(req.params.accId)
        .then(result => {
            res.format({
                "application/json": () => {
                    res.send(result)
                },
                "default": () => {
                    let locals = Object.assign({}, res.locals, {"usersList": result})
                    res.render("usersList", result)
                }
            })
        })
        .catch(err => {
           err.status = 500
           next(err)
        })
    }) 
})

router.get('/employee_list', function(req, res, next) {
        Users.fetchEmployeeList(req.params.accId)
        .then(result => {
            res.format({
                "application/json": () => {
                    res.send(result)
                },
                "default": () => {
                    let locals = Object.assign({}, res.locals, {"fetchEmployeeList": result})
                    res.render("fetchEmployeeList", result)
                }
            })
        })
        .catch(err => {
           err.status = 500
           next(err)
        })
})

router.post('/image_upload' ,verifyToken,async(function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        let body = JSON.parse(Object.keys(req.body)[0]);
        console.log(body)
        if(body.userName !==null && body.userName!=="" && body.image !==null && body.image!=="" )
        {
            let result = await(Users.setUsersImage(body.userName,body.image));
            // console.log(req.body.userName)
            // console.log(result)
            if(result.affectedRows > 0 )
            {
                res.send({"status" : 200, "message":"success"})
            }
            else
            {
                res.send({"status" : 420, "message":"failed to insert"})
            }
        }
        else {
            res.send({"status" : 420, "message":"failed to insert"})
        }
    })
}))


router.post('/add_user',verifyToken,async(function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        try {
            let body = JSON.parse(Object.keys(req.body)[0]);
            console.log(body)
            var pattern = /^[0-9]*$/; 
            var pattern1 = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            let tdateReg=new Date().getTime();
            let tPassword=body.companyId.toString(16)+ tdateReg.toString(16);  
            console.log(tPassword)
            jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err) {
                    res.send({"status" : 403, "message":"post failed"})
                } 
                else {
                    if( body.name!==null && body.name!=="" && body.companyId !==null && body.companyId!=="" && body.userName!==null && body.userName!==""&& body.email!==null && body.email!=="" && body.mobile.num !==null && body.mobile.num !=="" && body.mobile.num.match(pattern) && body.email.match(pattern1) ) 
                    {  
                        let result = await(Users.setUserAccount(body.name,body.companyId,body.userName,body.email,body.mobile,tPassword));
                        if(result.affectedRows > 0 )
                        {
                            let mail= await(Users.sendEmail(body.name,body.email,tPassword));  
                            if(mail) {
                                res.send({"status" : 200, "message":"success"})
                            }
                            else{
                            res.send({"status" : 420, "message":"failed"})
                            }
                        }
                        else {
                            res.send({"status" : 420, "message":"failed to insert"})
                        }
                    }   
                    else{
                        res.send({"status" : 420, "message":"failed to insert"})
                    }   
                }
            });
        }
        catch(err) 
        {
            console.log(err);
        }
    })
}))

module.exports = router
