const JWT= require('jsonwebtoken');

const {ACCESS_TOKEN_SECRET} = require('../config/index'); //env variables imported

const {REFRESH_TOKEN_SECRET} = require('../config/index'); //env variables imported

const RefreshToken = require('../models/token');

class JWTService {
    //sign acees token
    static signaccesstoken (payload, expiry)
    {
        const expiresIn = expiry.toString() + 's'; // 's' for seconds, 'm' for minutes, 'h' for hours

        return JWT.sign(payload,ACCESS_TOKEN_SECRET, {expiresIn});
    }
    //sign refresh token
    static signrefreshtoken (payload, expiry){

        const expiresIn = expiry.toString() + 's'; // 's' for seconds, 'm' for minutes, 'h' for hours

        return JWT.sign (payload, REFRESH_TOKEN_SECRET, {expiresIn});

    }
    //verify access token
    static verifyacesstoken (token) { //token is the token we are getting from the user
            try {
                return JWT.verify(token, ACCESS_TOKEN_SECRET);// TOKENS WILL BE MATCHED AND VERIFIED HERE
            }

            catch (error) {
                return null;
            }
    
        }
    //verify refresh token

    static verifyrefreshtoken (token) { //token is the token we are getting from the user
        try {
            return JWT.verify(token, REFRESH_TOKEN_SECRET); //token will be matched and verified here
        }

        catch (error) {
            return null;
        }
        

}
    //store refresh token

    static async storrefreshtoken (token,userId) {
        try {
            
            const newToken = new RefreshToken ({
                token:token,
                userId: userId

            });

            //store in db

            await newToken.save();
        }
        catch (error) {
            throw error;
        }

    }
}

module.exports = JWTService;