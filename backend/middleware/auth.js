const JWTService = require('../services/JWTService');

const User = require('../models/users');

const UserDTO = require('../dto/user');


const auth = async (req,res,next) => {

    try {
        //1. validate refresh and access tokens

    const {refreshToken,accessToken} = req.cookies;

    if (!refreshToken || !accessToken) {
        const error = {
            status:401,
            message:'Unauthorized'

        }

        return next(error);
    }

    let _id;

    try {
            _id = JWTService.verifyacesstoken (accessToken)._id;
    }

    catch(error) {
        return next(error);
    }

    //on the basis of id we will fetch the user details

    let user;

    try{
        user = await User.findOne({_id:_id});
    }

    catch (error)
    {
        return next (error);
    }

    const userdto = new UserDTO (user);

    req.user = userdto;

    next();

    }

    catch (error) {
        return next(error);
    }
    
    
}

module.exports = auth;
