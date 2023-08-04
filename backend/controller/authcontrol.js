const Joi = require ('joi');
const User = require ('../models/users');
const bcrypt = require ('bcryptjs');
const Userdto = require ('../dto/user');
const JWTService = require ('../services/JWTService');
const RefreshToken = require('../models/token');
//const users = require('../models/users');
//const UserDTO = require('../dto/user');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const authcontrol = {
    async register (req,res,next) {
        //1. validate user input => password should match the rules defined

        // WE EXPECT THE INPUT DATA TO BE IN SUCH SHAPE(CONCEPT OF DTO)
        const userRegisterSchema = Joi.object ({
            username : Joi.string().min(5).max(30).required(),
            name : Joi.string().max(30).required(),
            email : Joi.string().email(),
            password : Joi.string().pattern(passwordPattern).required(),
            confirmPassword : Joi.ref('password') //will confirm that password and confirmredpassword are same

        });

        const {error} = userRegisterSchema.validate (req.body); //will validate the incoming data from user, if theres an error then we get an object type of error or else the object is NULL
        //2. if error in validation -> return error via middleware (have to make a middleware)

        if (error) {
            return next(error); //next will call the next middleware. SInce we have one middleware only so it will call that and throw the error
        }
        //3. if email/username already registered -> return error

        const {username, name, email, password} = req.body; //to bring what to us what user has entered
                        //check if email/username has not been already registered
        try {

            const emailInUse = await User.exists({email}); //in user collection no matching email should be present
            const UsernameInUse = await User.exists({username});

            if (emailInUse) {
                const error = {
                    status : 409,
                    message: 'Email already used, use another email',
                }
                return next (error); //middleware called
            }

            if (UsernameInUse) {
                const error = {
                    status : 409,
                    message: 'Username not availbale, choose another username',
                }
                return next (error); //middleware called
            }


        }

        catch (error) {
            return next(error);
            
        }
        
        //4. no error -> password hashed
                //hashing means calling a function that will convert the entered password into a random state
        const HashedPassword = await bcrypt.hash(password, 10); //10 additional added after hashing for additional security

        //5. store user in db

        let accessToken; // generating an acess and a refresh token
        let refreshToken;
        let user;

        try {

            const UsertoRegister = new User ({
                username, 
                email,
                name,
                password: HashedPassword
            });
    
            user = await UsertoRegister.save();

            //work with token generation here
            accessToken = JWTService.signaccesstoken({_id:user._id}, '30m'); //user id and email given as the payloads and 30minutes set as the expiry time

            refreshToken = JWTService.signrefreshtoken ({_id:user._id},'60m');

            //have to send these tokens on the client side now and this will be done in cookies
        }
        
        catch(error){
            return next(error);
        }

        //store refresh token in db

        await JWTService.storrefreshtoken(refreshToken, user._id);

        //send token to cookies
        
        res.cookie('AccessToken', accessToken,{
            maxAge: 1000*60*60*24, //expiry time of the cookie set to 1 day
            httpOnly: true //client side per javascript wont be able to access it can only be accessed on the backend
        });

        res.cookie('RefreshToken',refreshToken,{
            maxAge: 1000*60*60*24, //expiry time of the cookie set to 1 day
            httpOnly: true //client side per javascript wont be able to access it can only be accessed on the backend
        });

        //6. response sent to user

        const uSerdto = new Userdto(user);
        return res.status(201).json({user : uSerdto, auth:true}); //auth true more will become  ore clear when developing front end
    },

    async login(req,res,next) {
        //1- validate user input
        //2- if validation error return error using error handling
        //3- match username and password
        //4- return response

        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required(),
        });

        const {error} = userLoginSchema.validate(req.body);

        if (error){
            return next(error);
        }

        const {username,password} = req.body;
        let user; //user made global

        try {
            // username should be matched
            user = await User.findOne({username}); //will get the whole user record

            if (!user) {
                const error = {
                    status: 401,
                    message: 'Invalid username'
                }

                return next(error);
            }

            //match passwords
            //req.body.password -> hash

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                const error = {
                    status: 401,
                    message: 'Invalid Password'
                }

                return next(error);
            }
        }

        catch (error){
            return next(error);

        }

        const accessToken = JWTService.signaccesstoken({_id:user._id}, '30m');
        const refreshToken = JWTService.signrefreshtoken({_id:user._id}, '60m');

        //update refresh token in db. Current user ki id k corresponding jo token hai update that since we generated a new refresh token for the user if no token then new token will be made
        try {
            await RefreshToken.updateOne ({ //if matching record found then the token gets updated and if no matching record then add a new token
                _id: user._id
            },
            {token : refreshToken},
            {upsert: true} 
            )
        }

        catch (error) {
            return next(error);
        }
        

        res.cookie('AccessToken', accessToken,{
            maxAge: 1000*60*60*24, //expiry time of the cookie set to 1 day
            httpOnly: true //client side per javascript wont be able to access it can only be accessed on the backend
        });

        res.cookie('RefreshToken',refreshToken,{
            maxAge: 1000*60*60*24, //expiry time of the cookie set to 1 day
            httpOnly: true //client side per javascript wont be able to access it can only be accessed on the backend
        });

        const userdto = new Userdto(user); //response that will be returned will now be in the shape which we have defined

        return res.status(200).json({user:userdto, auth:true}); //userdto (the defined shape) will be returned

    },

    async logout(req,res,next){

        console.log(req);
        //1. delete refresh token from db

        const {refreshToken} = req.cookies;

        try {
            await RefreshToken.deleteOne ({token:refreshToken}); //have to delete that record where the value of token matchs with the refreshToken
        }
        catch (error) {
            return next(error);
        }

        //delete cookies

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        
        //2. send response to user by which client side will know that the user is unauthenticated

        res.status(200).json({user:null, auth:false}); //use of auth we will get to know when working on frontend
    },

    async refresh(req,res,next){

        //1. get refresh token from cookies

        const originalrefreshtoken = req.cookies.refreshToken;

        //2. verify the refresh token

        let id;

        try{

            id = JWTService.verifyrefreshtoken(originalrefreshtoken)._id;
        }

        catch (e) {
            const error = {
                status:401,
                message: 'Unauthorized'
            }

            return next (e);
        }

        try {

            const match = await RefreshToken.findOne({id:_id, token: originalrefreshtoken});

            if (!match) {

                return res.status(401).json({ error: 'Unauthorized' });
            }

        }

        catch (e) {

            return next (e);
        }

        //3. if verified generate new token

        try {

            const at = JWTService.signaccesstoken ({id:_id},'30m');

            const rt = JWTService.signrefreshtoken ({id:_id},'60m');

            //send these token to cookies

            await RefreshToken.updateOne ({id:id} , {token:rt});

            res.cookie ('accessToken' , at, {
                maxAge: 1000 * 60 * 60 *24,
                httpOnly: true
            })

            res.cookie ('refreshToken' , rt, {
                maxAge: 1000 * 60 * 60 *24,
                httpOnly: true
            });
        }

        catch (e) {

            return next (e)
        }

        //4.update db and return response

        const user = await User.findOne({id:_id});

        const userDTO = new Userdto(user);

        return res.status(200).json({user:userDTO, auth:true});
    }

}

module.exports = authcontrol;