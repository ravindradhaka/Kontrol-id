"use strict";

const express = require('express');
const  app = express();
const config = require('./config/mongodb');
const mongoose = require('mongoose');
// sets up the app
require('./scripts/bootstrap')(app);
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin,x-access-token");
  res.header('Access-Control-Request-Method', 'GET,HEAD,OPTIONS,POST,PUT');
  res.header('Access-Control-Allow-Credentials', true);
  if ('OPTIONS' === req.method) {
      res.send(200);
  } else {
      next();
  }
});

app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

const routes = require('./routes/index');

// app.get('/attendance_report', routes.attendance)
app.get('/home', routes.home);
app.get('/country_list', routes.signup);
app.get('/entity_list/:accId', routes.organization);
app.get('/department_list/:accId', routes.organization);
app.get('/company_list/:accId', routes.organization);
app.get('/users_list/:accId', routes.users);
app.get('/subusers_data/:accId/:userName',routes.users);
app.get('/employee_list',routes.users)
app.get('/schedules_list',routes.roaster);
app.get('/roster_report/:reportType/:id',routes.roaster);
app.get('/attendance_report/:date/:id',routes.attendance);

app.post('/subusers_attendance',routes.attendance);

app.post('/shift_timings',routes.roaster);
app.post('/shift_timings',routes.roaster);
app.post('/user_signup', routes.signup);
app.post('/send_mail', routes.signup);
app.get('/company_details', routes.signup);
app.post('/resend_otp', routes.signup);
app.post('/user_login', routes.login);
app.post('/user_logout', routes.login);
app.post('/check_user', routes.login);
app.post('/add_company', routes.organization);
app.post('/organization_flag', routes.organization);
app.post('/add_entity', routes.organization);
app.post('/add_department', routes.organization);
app.post('/delete_company', routes.organization);
app.post('/add_user', routes.users);
app.post('/image_upload',routes.users);
app.post('/update_subusers_data',routes.users);
app.post('/add_schedule',routes.roaster);
app.post('/delete_roster',routes.roaster);
app.post('/edit_roster',routes.roaster);
app.post('/add_rule',routes.rules);
app.post('/attendance',routes.attendance);
// app.post('/test', routes.ProductSchema);
mongoose.connect('mongodb://localhost:27017/node-test');
let db = mongoose.connection;
let products = require('./routes/products');
app.post('/register', products);

require('./scripts/errorhandling')(app);


module.exports = app;
