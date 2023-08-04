const Joi = require('joi');
const Comment = require('../models/comments');
const CommentDTO = require('../dto/comment');


const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;


const commentcontrol =  {

    async create (req,res,next){

        const createcommentschema = Joi.object({
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blog: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = createcommentschema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {content, author, blog} = req.body;

        //saving a new record using try and catch

        try {

            const newComment = new Comment ({ //making an object of type comment and pasing content, author and blog in it
                content, author, blog  
            });

            await newComment.save();
        }
        catch (error) {
            return next(error);
        }

        return res.status(201).json({message: 'comment created'});
    
    },
    
    
    async getbyId (req,res,next){

        const getbyIdSchema = Joi.object ({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

        const {error} = getbyIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        const {id} = req.params;

        let comments; //comments here are in the form of an array

        try {
            comments = await Comment.find({blog: id}).populate('author');
        }

        catch (error) {

            return next (error);
        }

        let commentsDTO = [];

        for (i=0; i<comments.length; i++) {

            const obj = new CommentDTO (comments[i]);
            commentsDTO.push(obj);
        }

        return res.status(201).json({data: commentsDTO});
    }



}

module.exports = commentcontrol;