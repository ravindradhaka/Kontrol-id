console.log("hello");
const router = (require('express')).Router()
const Rules = require('../models').Rules
const verifyToken = require('../config/jwt')
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const config = require("../config/config.json");
const async = require('asyncawait/async');
const await = require('asyncawait/await');

router.post('/add_rule',verifyToken, async(function(req, res, next){
  jwt.verify(req.token,'secretkey',(err,authData) =>
  {
      if(err) {
          res.send({"status" : 600, "message":"forbidden"});
      }
      try {
          console.log(req.body);
          console.log(req.body.rule)
          let result = await(Rules.addRule(req.body));
          res.send({"status" : 200, "message":"rule added "});
      } catch(err){
          console.log(err);
      }
  });
}));


module.exports = router;
