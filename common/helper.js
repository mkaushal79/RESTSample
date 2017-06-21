
var config = require("../settings");

// CONVERTS QUERY PARMS INTO PAGING CRITERIA FOR MONGODB QUERY
module.exports.getPagingCriteria = function(req){
    var pagingCriteria={}; 
    var pageNum = !isNaN(req.query.pageNum) ? parseInt(req.query.pageNum): 0;
    var pageSize = !isNaN(req.query.pageSize) ? parseInt(req.query.pageSize): config.pageSize; 

    if(pageNum > 0){        
         pagingCriteria = {
             skip : pageSize * (pageNum - 1),
             limit: pageSize 
        };
    }else{
        pagingCriteria = {
             skip: 0,
             limit: pageSize 
        };
    }
  return(pagingCriteria);
}

// CONVERTS PARAM ARGUMENTS INTO SORT CRITERIA FOR MONGODB QUERY
module.exports.getSortCriteria = function(req){

var rawCriteria = req.query.sort || '';
var sortCriteria = {};
if(rawCriteria.trim().length > 0){
   var keys = rawCriteria.split(",");
  
   for(i=0;i<keys.length;i++){
       var order = keys[i].startsWith("-") ? -1 : 1;
       var fldName = keys[i].startsWith("-")? keys[i].substring(1,keys[i].length): keys[i]; 
       sortCriteria[fldName] = order;
       }
   }
  return(sortCriteria); 
};

