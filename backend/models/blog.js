const mongoose = require('mongoose');

const {Schema} = mongoose;

const blogSchema = new Schema ({
    title : {type: String, required:true},
    content : {type: String, required:true},
    photoPath : {type: String, required:true},
    author : {type:mongoose.SchemaTypes.ObjectId, ref : 'Users'} //author type is users
},
    {timestamps:true} //timestamp to be noted for each activity
);

module.exports = mongoose.model ('Blog', blogSchema, 'blog'); //name of model, schema of model, the name by which we have to establish the connection in our db