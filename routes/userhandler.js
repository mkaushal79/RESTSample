var dbManager = require("../db/dbmanager");
var responseWriter = require("../httpHandler/responseWriter");
var settings = require("../settings");
var helper = require("../common/helper");
var _ = require('lodash');
const colName = "users";

// ROUTE HANDLER FOR FETCHING ALL RECORDS
module.exports.getAll = function(req,res){
  var pagingCriteria = helper.getPagingCriteria(req);
  var sortingCriteria = helper.getSortCriteria(req);

  var pageNum = 0;
  dbManager.executeFind(colName,'', sortingCriteria,pagingCriteria ,function(status,result,err){
        if(status){
            responseWriter.send200(res,result);
        }else
        {
            responseWriter.send500(res,err);
        }
   });
};

// ROUTE HANDLER FOR FETCHING ON RECORD BY OBJECTID
module.exports.getOne = function(req,res){
   var uid = req.params.uid;
   
   dbManager.executeFindByObjectID(colName,uid,function(status,result,err){
        if(status){
            responseWriter.send200(res,result);
        }else
        {
            responseWriter.send500(res,err);
        }
   });
};

// ROUTE HANDLER FOR POST REQUEST
module.exports.create = function(req,res){
    validateAndSanitizeInputs(req,'post');
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
                result.useFirstErrorOnly();
                var vErrors = result.array();
                responseWriter.send400(res,vErrors);
        }else{
                var values = getEntityFromRequest(req,"post");
                dbManager.executeInsert(colName, values,function(status,objResult,err){
                    if(status){
                        responseWriter.send200(res,objResult);
                    }else
                    {
                        responseWriter.send500(res,err);
                    }
                });    
        }
    });
};


//ROUTE HANDLER FOR UPDATE REQUEST  
module.exports.update = function(req,res){
    validateAndSanitizeInputs(req,'put');
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
                result.useFirstErrorOnly();
                var vErrors = result.array();
                responseWriter.send400(res,vErrors);
        }else{
                var values = getEntityFromRequest(req,"put");
                var compValues = _.omitBy(values,_.isUndefined);
                if(compValues !== {}){
                    dbManager.executeUpdate(colName, req.body.id, values,function(status,objResult,err){
                        if(status){
                            responseWriter.send200(res,objResult);
                        }else
                        {
                            responseWriter.send500(res,err);
                        }
                    });
                }else{
                    responseWriter.send500(res,[{param: 'generic', message: 'Atleast one parameter required for update'}]);
                }    
        }
    });
};


// ROUTE HANDLER FOR DELETE REQUEST
module.exports.delete = function(req,res){
    var uid = req.params.uid;
   
   dbManager.executeDeleteByObjectID(colName,uid,function(status,objResult,err){
        if(status){
            responseWriter.send200(res,objResult);
        }else
        {
            responseWriter.send500(res,err);
        }
   });
};

// DATA OBJECT FOR UPDATES TO DOCUMENT/RECORD
function getEntityFromRequest(req,mode){  

       var values = {
           "fname" : req.body.fname!== undefined? req.body.fname.trim(): undefined ,
           "lname" : req.body.lname!== undefined? req.body.lname.trim(): undefined,
           "uname" : req.body.uname!== undefined? req.body.uname.trim(): undefined,
           "pwd"   : req.body.pwd!== undefined? req.body.pwd.trim(): undefined,
           "email" : req.body.email!== undefined? req.body.email.trim(): undefined
       };

       return(values);

}

// INPUT VALIDATOR. ALSO, CLEANS DATA FOR SAVIGN IN DB.
function validateAndSanitizeInputs(req,mode){
    
    // PERFORM VALIDATIONS 
    if(mode === 'post'){
            req.checkBody('fname',"First name is required").notEmpty();
            req.checkBody('uname', "Username must be between 8-16 characters").isLength({min:8, max: 16});
            req.checkBody('pwd', "Password must be between 8-16 characters").isLength({min:8, max: 16});
            req.checkBody('email', "Invalid Email address").notEmpty().withMessage('Email is required').isEmail();
    }
    else if (mode.toLowerCase() === 'put') {
            req.checkBody('id',"Valid objectID required.").isMongoId();
            req.checkBody('uname', "Username must be between 8-16 characters").optional({checkFalsy:true}).isLength({min:8, max: 16});
            req.checkBody('pwd', "Password must be between 8-16 characters").optional({checkFalsy:true}).isLength({min:8, max: 16});
            req.checkBody('email', "Email is required.").optional({checkFalsy:true}).isEmail();
    } else if (mode.toLowerCase() === 'delete'){
            req.check('id',"Invalid Mongo Object ID").notEmpty().isMongoID();
    }
  
    // SANITIZE INPUTS TO AVOID CSR
    req.sanitize('fname').escape();
    req.sanitize('lname').escape();
    req.sanitize('uname').escape();
    req.sanitize('email').escape();
    
}
