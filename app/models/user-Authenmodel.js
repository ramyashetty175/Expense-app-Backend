//const { number } = require('joi');
const mongoose = require('mongoose');

const UserAuthenSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    newpassword: String,
    loginCount: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'user'
    },
    failedLoginAttempts: {
       type: Number,
       default: 0
    },
    isLocked: {
       type: Boolean,
       default: false
    }
},{ timestamps: true })

const User = mongoose.model('User', UserAuthenSchema);

module.exports = User;
