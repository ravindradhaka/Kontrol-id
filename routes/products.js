
const router = (require('express')).Router()
const ProductSchema = require('../models').ProductSchema
const verifyToken = require('../config/jwt')
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const config = require("../config/config.json");
const async = require('asyncawait/async');
const await = require('asyncawait/await');
var moment = require('moment');

// Require the controllers WHICH WE DID NOT CREATE YET!!
const Product = require('../models/product');


// a simple test url to check that all of our files are communicating correctly.

router.post('/register', function(req, res){
  var myData = new Product(req.body);
  console.log(myData);
  myData.save()
  .then(item => {
  res.send("item saved to database");
  })
  .catch(err => {
  res.status(400).send("unable to save to database");
  })
});


module.exports = router;
