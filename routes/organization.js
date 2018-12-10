const router = (require('express')).Router()
const verifyToken = require('../config/jwt')
const jwt = require('jsonwebtoken');
const Organization = require('../models').Organization
const async = require("asyncawait/async");
const await = require("asyncawait/await");

router.get('/company_list/:accId' ,function(req, res, next) {
        Organization.getCompanyList(req.params.accId)
        .then(result => {
            res.format({
            "application/json": () => {
                res.send(result);
            },
            "default": () => {
                let locals = Object.assign({}, res.locals, {"companyList": result});
                res.render("companyList", result);
            }
            })
        })
        .catch(err => {
            err.status = 500;
            next(err);
        })
})

router.post('/add_company',verifyToken ,async(function(req, res,next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err){
            res.send({"status" : 421, "message":"forbidden"});
        }
        try {
            let body = JSON.parse(Object.keys(req.body)[0]);
            if(body.orgName.length > 0 && body.cinNumber.length > 0 && body.regAddress.buildingName.length > 0 && body.regAddress.streetName.length > 0 && body.regAddress.city.length > 0 && body.regAddress.state.length > 0 && body.regAddress.pin.length > 0 && body.regAddress.country.length > 0 && body.corpAddress.buildingName.length > 0 && body.corpAddress.streetName.length > 0 && body.corpAddress.city.length > 0 && body.corpAddress.state.length > 0 && body.corpAddress.pin.length > 0 && body.corpAddress.country.length > 0 && body.gstinNumber.length > 0) {
                let companyDetails = await(Organization.fetchCompanyDetails(body.accName));
                if(companyDetails.length > 0) {
                    let ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    let addNewCompany = await(Organization.addNewCompany(body,companyDetails[0].userid,companyDetails[0].dbName,ip))
                    if(addNewCompany.affectedRows > 0) {
                        res.send({"status" : 200, "message":"success"})
                    } else {
                        res.send({"status" : 420, "message":"failed to insert"})
                    }
                }
            } else {
               res.send({"status" : 420, "message":"Please check all fields with *"});
            }
        } 
        catch(err) 
        {
            console.log(err);
        }
    }) 
}))

router.post('/organization_flag',verifyToken, async(function(req, res,next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        try {
            let body = JSON.parse(Object.keys(req.body)[0]);
            let userId = await(Organization.getUserId(body.id));
            if(userId.length > 0) {
                let columnVal = (parseInt(body.type) == 1) ? 'setDefault' : 'hq';
                let updateValue = await(Organization.setOrganizationFlag(body.id,columnVal));
                let updateOtherValue = await(Organization.setOtherOrganizationFlag(userId[0].userId, body.id, columnVal));
                if(updateValue.affectedRows > 0 && updateOtherValue.affectedRows > 0) {
                    res.send({"status" : 200, "message":"success"})
                } else {
                    res.send({"status" : 420, "message":"failed to insert"})
                }
            } else {
                res.send({"status" : 420, "message": "Something went wrong"});
            }
        } 
        catch(err)
        {
            console.log(err);
        }
    })   
}))

router.get('/entity_list/:accId',verifyToken, function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        Organization.getEntityList(req.params.accId)
        .then(result => {
            res.format({
                "application/json": () => {
                res.send(result);
                },
                "default": () => {
                let locals = Object.assign({}, res.locals, {"EntityList": result});
                res.render("EntityList", result);
                }
            })
        })
        .catch(err => {
            err.status = 500;
            next(err);
        })
    })    
})

router.post('/add_entity',verifyToken ,async(function(req, res,next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        try {
            let body = JSON.parse(Object.keys(req.body)[0]);
            console.log(body);
            if(body.companyId.length > 0 && body.entityName.length > 0 && body.type.length > 0 && body.location.length > 0) {
                let companyDetails = await(Organization.fetchUserId(body.accName));
                if(companyDetails.length > 0) {
                    let ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    let addNewEntity = await(Organization.addNewEntity(body,companyDetails[0].id,ip))
                    console.log(addNewEntity);
                    if(addNewEntity.affectedRows > 0) {
                        res.send({"status" : 200, "message":"success"})
                    } else {
                        res.send({"status" : 420, "message":"failed to insert"})
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

router.get('/department_list/:accId',verifyToken, function(req, res, next) {
    jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        Organization.getDepartmentList(req.params.accId)
        .then(result => {
            res.format({
                "application/json": () => {
                res.send(result);
                },
                "default": () => {
                    let locals = Object.assign({}, res.locals, {"DepartmentList": result});
                    res.render("DepartmentList", result);
                }
            })
        })
        .catch(err => {
            err.status = 500;
            next(err);
        })
    })    
})

router.post('/add_department',verifyToken ,async(function(req, res,next) {
  jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        try {
            let body = JSON.parse(Object.keys(req.body)[0]);
            console.log(body);
            if(body.companyId.length > 0 && body.entityId.length > 0 && body.name.length > 0 && body.subDept.length > 0) {
                let companyDetails = await(Organization.fetchUserId(body.accName));
                if(companyDetails.length > 0) {
                    let addNewDept = await(Organization.addNewDepartment(body,companyDetails[0].id))
                    console.log(addNewDept);
                    if(addNewDept.affectedRows > 0) {
                        res.send({"status" : 200, "message":"success"})
                    } else {
                        res.send({"status" : 420, "message":"failed to insert"})
                    }
                }
            }
            else {
               res.send({"status" : 420, "message":"Please check all fields with *"});
            }
        }
        catch(err) {
            console.log(err);
        }
    })   
}))

router.post('/delete_company',verifyToken ,async(function(req, res,next) {
  jwt.verify(req.token,'secretkey',(err,authData) =>
    {
        if(err) {
            res.send({"status" : 421, "message":"forbidden"});
        }
        try {
            let body = JSON.parse(Object.keys(req.body)[0]);
            console.log(body);
            let result = await(Organization.setActiveCompany(body.id));
            if(result.length > 0) {
                res.send({"status" : 200, "message":"success"})
            } else {
                res.send({"status" : 420, "message": "Something went wrong"});
            }
        } 
        catch(err) {
            console.log(err);
        }
    })
    
}))

module.exports = router;
