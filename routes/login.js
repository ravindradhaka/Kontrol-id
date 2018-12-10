const router = (require('express')).Router()
const jwt = require('jsonwebtoken');
const Login = require('../models').Login
const verifyToken = require('../config/jwt')
const config = require("../config/config.json");
var crypto = require('crypto');
const async = require('asyncawait/async');
const await = require('asyncawait/await');


router.post('/user_login', async(function(req, res, next) {
  try {
    let body = JSON.parse(Object.keys(req.body)[0]);
    let result = await(Login.getUserDetails(body.accName));
    if(result.length > 0) {
      const hmac = crypto.createHash('sha512').update(body.password+""+result[0].salt).digest('hex');
      if(hmac == result[0].password && body.userName == result[0].userName) {
        jwt.sign({userName: body.userName, email: body.email,accName: body.accName}, 'secretkey', { expiresIn: '24h' }, (err, token) => {
          if(err) {
            res.send({"status":420,"message":"forbidden"});
          }
          res.send({"status":200,"message":"login successful",data : {"accName": body.accName, "name": result[0].name,"email":body.email,"token":"TOKEN "+token}});
        });
      } else {
        res.send({"status":420,"message":"Username or Password is incorrect"});
      }
    }
    else
    {
      res.send({"status":420,"message":"Please register yourself before login"});
    }
  }
  catch(err)
  {
    console.log(err);
  }
}))

router.post('/user_logout',verifyToken,function(req, res, next) {
    if(err) {
      res.send({"status" : 421, "message":"forbidden"});
    }
    res.send({"status":200});
})

router.post('/check_user',verifyToken,async(function(req, res, next) {
  jwt.verify(req.token,'secretkey',(err,authData) =>
  {
    if(err) {
      res.send({"status" : 421, "message":"forbidden"});
    }
    try {
      let body = JSON.parse(Object.keys(req.body)[0]);
      result = await(Login.getUserDetails(body.accName));
      if(result.length > 0) {
        res.send({"status":420,"message":"Account name exists"});
      }
      else {
        res.send({"status":420,"message":"Please register yourself before login"});
      }
    }
    catch(err)
    {
      console.log(err);
    }
  })
}))

module.exports = router
