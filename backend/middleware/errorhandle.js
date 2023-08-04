const {ValidationError} = require ('joi');


const errorhandle = (error,req,res, next) => {
    //default error
    let status = 401;
    let data = {
        message: 'Internal Server Error' //default message
    }

    if (error instanceof ValidationError) {  //this will be done when the error is from joi
        status = error.status;
        data.message = error.message;
        return res.status(status).json(data);
    }

    if (error.status) {  //these will run when the error has message/status
        status = error.status; 
    }

    if (error.message) {
        data.message = error.message;
    }

    return res.status(status).json(data);

}

module.exports = errorhandle;

//when the error is neither validation nor others then default erro will be thrown which has the message
// 'internal server error'