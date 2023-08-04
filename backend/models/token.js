const { default: mongoose } = require('mongoose');
const monogoose = require('mongoose');

const {Schema} = mongoose;

const refreshToken = Schema({
    token: {type: String, required: true},
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: 'Users'}, //token issued to which user


},
    {timestamps: true}
)

module.exports = mongoose.model ('Refresh Token', refreshToken, 'Tokens');