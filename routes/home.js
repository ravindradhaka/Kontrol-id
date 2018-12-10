const verifyToken = require('../config/jwt')
const jwt = require('jsonwebtoken');
const router = (require('express')).Router()

const Home = require('../models').Home



router.get('/home',verifyToken ,function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        Home.getContent()
        .then(result => {
            res.format({
                "application/json": () => {
                    res.send(result)
                },
                "default": () => {
                    let locals = Object.assign({}, res.locals, {"homecontant": result})
                    res.render("homecontant", result)
                }
            })
        })
        .catch(err => {
            err.status = 500
            next(err)
        })
    })
    
})

module.exports = router
