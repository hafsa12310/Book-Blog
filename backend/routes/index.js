const express =require ('express');
const authcontrol = require('../controller/authcontrol');
const auth = require('../middleware/auth');
const blogcontrol = require('../controller/blogcontrol');
const commentcontrol = require('../controller/commentcontrol');

const router = express.Router();


//testing endpoint

router.get('/test', (req,res) => res.json({msg:'Working'}));

// for user we need these routers: login, register, logout, refresh
// for blog we need these routers: create, read all, read a specific blog by id, update, delete
// for comments we need these routers: create comment, read comment by blog id 


//END POINTS FOR USERS

//register => user
router.post ('/register' , authcontrol.register);

//login => user

router.post ('/login' , authcontrol.login); //post used as information has to be taken from the user (UN,password)
                                            // whenevr login requested now, login controller will be executed

//logout

router.post ('/logout' , auth ,  authcontrol.logout); //authentication i.e user is authenticated or no will be done between req and response hence the auth will come in middle

//refresh

router.get ('/refresh' , authcontrol.refresh);

//END POINTS FOR BLOG

//create

router.post ('/blog' , auth, blogcontrol.create);

//get all

router.get('/blog/all' , auth, blogcontrol.getAll);

//get blog by id => will dipaly a specific blog according to the id

router.get('/blog/:id' , auth, blogcontrol.getById);

//update blog

router.put ('/blog' , auth, blogcontrol.update);

//delete blog

router.delete ('/blog/:id' , auth, blogcontrol.delete);

//END POINTS FOR COMMENTS

//create comment

router.post ('/comment' , auth, commentcontrol.create);

//get comment

router.get ('/comment/:id', auth, commentcontrol.getbyId);

module.exports = router;