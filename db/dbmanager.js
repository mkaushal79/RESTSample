var app = require("../app");
var config = require("../settings");
var mdb = require("mongodb");
var lodash = require("lodash");

var dbConnection = null;
/*
    METHOD CONNECTS TO DB MENTIONED IN SETTINGS.CONNECTIONSTRING.
    RETURNS: EITHER DB CONNECTION OR ERROR
    INITIALIZES: dbConnection VARIABLE TO HOLD THE CONNECTION FOR FUTURE REQUESTS
*/
exports.connectToDB = function(callback){
   mongoClient = mdb.MongoClient();
   try{
        mongoClient.connect(config.db.connectionString, function(err,db){
            if(err){
                callback(false,err);
            }else{
                dbConnection = db;
                callback(true,null);
            }    
        });
    } catch(ex){
       callback(false,ex);
    }
};

exports.executeFind = function(collectionName, whereClause, sortingCriteria, pagingCriteria, callback){
    if(dbConnection){
       try{
             var col =  dbConnection.collection(collectionName);
             var criteria = whereClause.trim()=== '' ? JSON.parse('{}') : JSON.parse(whereClause);
             if(col){
                col.find(criteria).sort(sortingCriteria).skip(pagingCriteria.skip).limit(pagingCriteria.limit).toArray(function(err,result){
                    if(err){
                        callback(false,null,err);
                    }else {
                        callback(true,result,null);
                    }
                });
             } else{
             throw Error('Invalid collection name');
          }
       }catch(ex){
           callback(false, null,ex);
       }
    }else{
       callback(false, null,"DB connection error.");       
    }

};

exports.executeFindByObjectID = function(collectionName, id, callback){
    
    if(dbConnection){
       try{
             var col =  dbConnection.collection(collectionName);
             var oid = mdb.ObjectID(id);

             if(col){
                col.find({'_id' : oid}).toArray(function(err,result){
                    if(err){
                        callback(false,null,err);
                    }else {
                        callback(true,result,null);
                    }
                });
             } else{
             throw Error('Invalid collection name');
          }
       }catch(ex){
           callback(false, null,ex);
       }
    }else{
       callback(false, null,"DB connection error.");       
    }
};

exports.executeDeleteByObjectID = function(collectionName, id, callback){
    
    if(dbConnection){
       try{
             var col =  dbConnection.collection(collectionName);
             var oid = mdb.ObjectID(id);

             if(col){
                col.remove({'_id' : oid},function(err,objResult){
                    if(err){
                        callback(false,null,err);
                    }else {
                        callback(true,objResult.result,null);
                    }
                });
             } else{
             throw Error('Invalid collection name');
          }
       }catch(ex){
           callback(false, null,ex);
       }
    }else{
       callback(false, null,"DB connection error.");       
    }
};

exports.executeInsert = function(collectionName, values, callback){
    if(dbConnection){
       try{
             var col =  dbConnection.collection(collectionName);
             var str = JSON.stringify(values);
             var data = JSON.parse(str);

             if(col!==null && data !== null ){
                col.insert(data,function(err,result){
                    if(err){
                        callback(false,null,err);
                    }else {
                        callback(true,result,null);
                    }
                });
             } else{
             throw Error('Invalid Data');
          }
       }catch(ex){
           callback(false, null,ex);
       }
    }else{
       callback(false, null,"DB connection error.");       
    }

};

exports.executeUpdate = function(collectionName, id, values, callback){
    if(dbConnection){
       try{
             var col =  dbConnection.collection(collectionName);
             var oid = new mdb.ObjectId(id);
             var str = JSON.stringify(values);
             var data = JSON.parse(str);

             if(col!==null && data !== null ){
                col.updateOne({'_id' : oid}, {$set:data},function(err,result){
                    if(err){
                        callback(false,null,err);
                    }else {
                        callback(true,result,null);
                    }
                });
             } else{
             throw Error('Invalid Data');
          }
       }catch(ex){
           callback(false, null,ex);
       }
    }else{
       callback(false, null,"DB connection error.");       
    }

};

