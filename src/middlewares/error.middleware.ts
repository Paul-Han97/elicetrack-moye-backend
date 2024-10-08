import { NextFunction, Request, Response } from "express";

const messageMap: {[key:number]:string} = {
    // Successful responses
    200:"OK",
    201:"Created",
    202:"Accepted",
    204:"No Content",

    // Client error responses
    400:"Bad Request",
    401:"Unauthorized",
    403:"Forbidden",
    404:"Not Found",
    
    // Server error responses
    500:"Internal Server Error",
    505:"HTTP Version Not Supported"
}

export function errorHandler(e:Error, req:Request, res:Response, next:NextFunction) {
    if(e.name !== 'Error') {
        res.status(500);
    }
    
    const statusCode = res.statusCode;
    
    if(statusCode === 500) {
        console.log(e.stack);
    }

    const statusMessage = messageMap[statusCode];
    const errorMessage = e.message;

    const status = {
        status_code: statusCode,
        message: `${statusMessage} ${errorMessage}`,
    }
    
    return res.send(status);
}
