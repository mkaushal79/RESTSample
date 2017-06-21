var dbManager = require("../db/dbmanager");
var responseWriter = require("../httpHandler/responseWriter");
var settings = require("../settings");
var helper = require("../common/helper");
var _ = require('lodash');
const colName = "courses";

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
           "title" : req.body.fname!== undefined? req.body.fname.trim(): undefined ,
           "description" : req.body.lname!== undefined? req.body.lname.trim(): undefined,
           "duration" : req.body.uname!== undefined? req.body.uname.trim(): undefined,
           "price"   : req.body.pwd!== undefined? req.body.pwd.trim(): undefined,           
       };

       return(values);

}

// INPUT VALIDATOR. ALSO, CLEANS DATA FOR SAVIGN IN DB.
function validateAndSanitizeInputs(req,mode){
    
    // PERFORM VALIDATIONS 
    if(mode === 'post'){
            req.checkBody('title', "Title must be between 10 and 150 characters.").isLength({min:8, max : 150});
            req.checkBody('price', "Price must be numeric and between 1 and 1000").isFloat({min: 1, max: 1000});
            
    }
    else if (mode.toLowerCase() === 'put') {
            req.checkBody('id',"Valid objectID required.").isMongoId();
            req.checkBody('title', "Title must be between 10 and 150 characters.").optional({checkFalsy:true}).isLength({min:8, max : 150});
            req.checkBody('price', "Price must be numeric and between 1 and 1000").optional({checkFalsy:true}).isFloat({min: 1, max: 1000});    
    } 
  
    // SANITIZE INPUTS TO AVOID CSR
    req.sanitize('title').escape();
    req.sanitize('description').escape();
    req.sanitize('duration').escape();
    
}
