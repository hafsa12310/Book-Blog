const mongoose= require('mongoose');

const {Schema} = mongoose;

const commentSchema = new Schema ({
    content : {type: String, required:true},
    blog : {type: mongoose.Schema.Types.ObjectId, ref: 'Blog'}, //for which blog comment has been written 
    author : {type: mongoose.Schema.Types.ObjectId, ref: 'Users'}
    
},
    {timestamps:true} //timestamp to be noted for each activity
);

module.exports = mongoose.model ('Comments', commentSchema, 'comments');