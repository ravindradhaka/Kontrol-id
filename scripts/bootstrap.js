module.exports = app => {

    "use strict";

    const bodyParser = require("body-parser")
    const mysql = require('mysql')

    global.db = require('./storage')

    app.use(bodyParser.json({limit: '10mb', extended: true}));
    app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
}
