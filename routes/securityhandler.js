var dbManager = require("../db/dbmanager");
var responseWriter = require("../httpHandler/responseWriter");
const colName = "users";

module.exports.generateToken = function(req,res){
  var uname = req.body.username || '';
  var pwd = req.body.password || '';

  if(uname.length>0 && pwd.length >0){
    var result = {
       "token" : "sdfss098098sdfsfslkjsfl=",
       "claims": ["admin","editor"]
    };
    responseWriter.send200(res,result); 
  }else{
      responseWriter.send400(res,"Username and Password are required.");
  }
};

module.exports.authenticate = function(req,res,next){
  var securityToken = req.get('token') || '';
  if(securityToken.length < 8){
    responseWriter.send401(res,'Security token either not provided or invalid. Please use login service to generate a new token.');
  }else{
    next();
  }
};

module.exports.authorize = function(req,res,next){
    var claims = [];

    try{
      claims = (req.get('claims')!== null && req.get('claims')!== '') ? JSON.parse(req.get('claims')) : [];
    }catch(ex){
        responseWriter.send401(res,'Claims conversion error');
    }
  
    if(claims.indexOf("admin")>=0){
      next();
    }else{
      responseWriter.send401(res,'Claim not available to access this service.');
    }
};
