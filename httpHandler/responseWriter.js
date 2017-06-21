module.exports.send200 = function(res, result){
   res.writeHead(200, {'Content-Type': 'application/JSON'});
   var msg = createJSONResponse(200,true,'Successful response included.', "RESPONSE_PAYLOAD" , '', result)
   res.write(JSON.stringify(msg));
   res.end();

};

module.exports.send400 = function(res, error){
  res.writeHead(400, 'Bad Request', {'Content-Type': 'application/JSON'});
  var msg = createJSONResponse(400,false,'Validation Errors',"VALIDATION_ERROR_LIST", error,'')
  res.write(JSON.stringify(msg));
  res.end();
};

module.exports.send401 = function(res, error){
  res.writeHead(401, 'Un-authroized Access', {'Content-Type': 'application/JSON'});
  var msg = createJSONResponse(400,false,'Access to the service not allowed', "UNAUTHORIZED_ACCESS", error,'');
  res.write(JSON.stringify(msg));
  res.end();
};

module.exports.send500 = function(res, error){
  res.writeHead(500, 'Internal Server Error', {'Content-Type': 'application/JSON'});
  var msg = createJSONResponse(500,false,'Internal Server Error', 'SERVER_ERROR' ,error,'')
  res.write(JSON.stringify(msg));
  res.end();
};

function createJSONResponse(httpStatusCode, isSuccessful, message, payloadType, error, payload){
  
    var msg = {
     "httpstatus" : httpStatusCode,
     "success": isSuccessful,
     "message": message,
     "payloadtype": payloadType,
     "error": error,
     "payload": payload
   };

  return(msg);
}