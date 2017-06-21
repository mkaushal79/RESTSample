exports.ErrorCodes = {
    DBNOTAVAILABLE: 503,
    APPLICATIONERROR: 500,
    BADREQUEST: 400,
    NOTFOUND: 404,
    FORBIDDEN: 403
}

function AppError(code,err){
    this.errorCode = code;
    this.message = err;
}

module.exports.RESTError = AppError;