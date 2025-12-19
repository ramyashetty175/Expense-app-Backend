const User = require('../models/user-Authenmodel');
const { UserRegisterValidation, UserLoginValidation, updatepasswordValidation } = require('../validations/user-AuthValidations');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendWelcomeEmail = require('../../utils/mailer');
const Category = require('../models/category-model');
const Expense = require('../models/expense-model');

const usersCtlr = {};

//User Registration
usersCtlr.register = async(req,res) => {
    const body = req.body;
    const { error, value } = UserRegisterValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const userByEmail = await User.findOne({ email: value.email });
        if(userByEmail) {
           return res.status(400).json({ msg: "email already exists" });
        }
        //creating new object
        const user = new User();
        user.username = value.username;
        user.email = value.email;
        const salt = await bcryptjs.genSalt();
        //hashing password
        const hash = await bcryptjs.hash(value.password, salt);
        user.password = hash;
        const userCount = await User.countDocuments();
        if(userCount == 0) {
           user.role = "admin";
        }
        await user.save();
        //await sendWelcomeEmail(user.email, user.username);
        res.status(201).json(user);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
}

//User Login
usersCtlr.login = async(req,res) => {
    const body = req.body;  
    const { error, value } = UserLoginValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const user = await User.findOne({ email: value.email });
        //handle error/false cases first
        if(!user) {
           return res.status(401).json({ error: "User not found" });
        }
        //compare the provided password with the stored hashed password to verify the user's credentials
        const passwordMatch = await bcryptjs.compare(value.password, user.password);
        if(!passwordMatch) {
           res.status(401).json({ error: "Invalid Email/password" });
        }
        //user once logged in increment the count because after logged in he can go anywhere in application(ex cart,orders)
        user.loginCount += 1;
        await user.save();
        //generate a JWT(JSON Web Token) containing relevent user information
        const tokenData = { userId: user._id, role: user.role };
        //console.log(tokenData);
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token: token });
    }catch(err) {
       console.log(err);
       res.status(500).json({ error: "Something went wrong!!!" });
    }
}

usersCtlr.account = async(req, res) => {
    try {
        const user = await User.findById(req.userId); // tokenData available via req object
        res.json(user);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong!!!" });
    }
}


usersCtlr.list = async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        await Category.deleteMany({ user: id });
        await Expense.deleteMany({ user: id });
        res.json(user);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

usersCtlr.updatepassword = async(req, res) => {
    const body = req.body;
    const { error, value } =  updatepasswordValidation.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        let password = value.password;
        let newpassword = value.newpassword;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.isLocked) {
            return res.status(403).json({ error: "Account is locked due to multiple failed attempts" });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
            if (user.failedLoginAttempts >= 3) {
                user.isLocked = true;
            }
            await user.save();
            return res.status(400).json({ error: "Current password is incorrect" });
        }
        user.failedLoginAttempts = 0;
        user.isLocked = false;
        const isSame = await bcryptjs.compare(newpassword, user.password);
        if (isSame) {
            return res.status(400).json({ error: "New password must be different from current password" });
        }
        const salt = await bcryptjs.genSalt();
        const hashedPassword = await bcryptjs.hash(newpassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.json(user);
    }catch(err) {
        console.log(err);
        return res.status(500).json({ error: "something went wrong!!!" });
    }
}

module.exports = usersCtlr;
