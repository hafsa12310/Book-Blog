const Joi = require('joi');
const fs = require ('fs'); //file system built in  module
const Blog = require('../models/blog');
const BACKEND_SERVER_PATH = require('../config/index');
const BlogDTO = require ('../dto/blog');
const BlogDetailsDTO = require ('../dto/blog-details');
const Comments = require ('../models/comments');

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogcontrol = { //`storage/${imagePath}`
    async create (req,res,next){
        //1.validate request body
        //2. handle photo storage and naming etc
        //3. add this blog record to db
        //4. return response

        const createBlogSchema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            content: Joi.string().required(),
            photo: Joi.string().required()  //sent from client side -> base64 encoded form -> decoded -> stored -> saved photo's path in db
        });

        //will validate now

        const {error} = createBlogSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        //if no error do this

        const {title, author, content, photo} = req.body;

        //handling the photo will be done in a few steps

        //1. read as buffer
        const buffer = Buffer.from (photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');

        //2. assign a random name

        const imagePath = `${Date.now()}-${author}.png` ; //current timestamp and author id-the unique new name of the photo
       
        //3. save it locally => separate folder made

        try {
            fs.writeFileSync(`/storage/${imagePath}`,buffer); // file saved in storage folder with the name we assigned in image path
        }

        catch (error) {

            return next(error);
        }

        //photo saved!

        //now save blog in db

        let newblog;

        try {
            newblog = new Blog ({
                title,
                author,
                content,
                photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`
            });

            await newblog.save();
        }

        catch (error) {
            return next (error);
        }

        const blogdto = new BlogDTO (newblog);

        return res.status(201).json({blog:blogdto});
        


    },

    async getAll (req,res,next){ //will send us the info of all blogs

        try { //no validation reuqired since we are not sending any data in the request body

            const blogs = await Blog.find();

            const blogDTO  = [];

            for (let i=0; i < blogs.length; i++) {

                const dto = new BlogDTO (blogs[i]);
                blogDTO.push(dto);
            }

            return res.status(200).json({blogs:blogDTO});
        }

        catch (error) {

            return next (error);
        }
    },

    async getById (req,res,next) { //will pass the id and all blogs associated with that id will be displayed
        
        //validate id
        //send response upon validation

        const getbyidschema = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = getbyidschema.validate(req.params); //data is being sent in request's parameters and not in the body of request hence req.params

        if (error) {

            return next(error);
        }

        let blog;

        const {id} = req.params;

        try {

            blog = await Blog.findOne({_id:id}).populate('author'); //this will display the info of the author aswell such as name,username email and password
        }

        catch (error) {
            return next (error);
        }

        const blogDTO = new BlogDetailsDTO(blog); 

        return res.status(200).json({blog:blogDTO});


    },

    async update (req,res,next) {
        //1.validate the request body
        //2.delete the previous photo if photo has to be updated, no deletion of photo if have to just update the title

        const updateblogschema = Joi.object({
            title: Joi.string().required(), //if we have to update the title then type in the new title or else type in the old title. (why used required?)
            content: Joi.string().required(), // same ans as above for using required
            author: Joi.string().regex(mongodbIdPattern).required(),
            blogId: Joi.string().regex(mongodbIdPattern).required(),
            photo: Joi.string()
        });

        const {error} = updateblogschema.validate(req.body);

        const {title, content, author, blogId, photo} = req.body;

        //if updating the photo then first we have to delete the previous photo then save the new photo

        let blog;

        try {
            blog = await Blog.findOne({_id:blogId}); // that blog needed whose id matches with the the given blog id
        }

        catch (error) {
            return next (error);
        }

        if (photo) { //when value given to photo is not null then..
             
            let previousPhoto = blog.photoPath;

            previousPhoto = previousPhoto.split('/').at(-1);

            //delete photo

            fs.unlinkSync(`/storage/${previousPhoto}`);

            //storing the new photo

            //1. read as buffer
            const buffer = Buffer.from (photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');

            //2. assign a random name

            const imagePath = `${Date.now()}-${author}.png` ; //current timestamp and author id-the unique new name of the photo
       
            //3. save it locally => separate folder made

        try {
            fs.writeFileSync(`/storage/${imagePath}`,buffer); // file saved in storage folder with the name we assigned in image path
        }

        catch (error) {

            return next(error);
        }

        await Blog.updateOne({_id:blogId},
            {title, content, photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`}
        );

        }
        
        else { //if have to update content

            await Blog.updateOne({_id:blogId}, {title, content});
        }

        return res.status(200).json({message:'blog updated'});
    
    },

    async delete (req,res,next) {
        //1. validate id
        //2.delete blog
        //3.delete comments too of that blog

        const deleteblogschema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),

        });

        const {error} = deleteblogschema.validate(req.params);

        const {id} = req.params;

        //now delete the blog and the comments corresponding to it

        try{

            await Blog.deleteOne({_id:id});

            //in comments model we have content author and blog
            //hence we can delete comments on the basis of the blog

            //deleting the comments

            await Comments.deleteMany ({blog: id});


        }

        catch (error) {
            return next (error);
        }

        return res.status(200).json({message: 'blog deleted'});

    }

}

module.exports = blogcontrol;