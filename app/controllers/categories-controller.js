const Category = require('../models/category-model');
const categoryValidationSchema = require('../validations/category-Validations');

const categoriesCtlr = {};

categoriesCtlr.create = async(req, res) => {
    const body = req.body; //const { body } = req - destructuring body from req object
    const { error, value } = categoryValidationSchema.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        //categories.find(ele => ele.name == value.name && user == req.userId)
        const categoryInDB = await Category.findOne({ name: value.name, user: req.userId });
        if(categoryInDB) {
            return res.status(400).json({ error: 'category already created' });
        }
        const category = new Category();
        category.name = value.name;
        //assign the userId to the object before saving to db
        category.user = req.userId;
        await category.save();
        res.json(category);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

categoriesCtlr.list = async(req, res) => {
    try {
        const categories = await Category.find({ user: req.userId });
        if(!categories) {
           return res.status(404).json({ error: 'record not found' });
        }  
        res.json(categories);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' }); 
    }
}

categoriesCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const { error, value } = categoryValidationSchema.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const category = await Category.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        if(!category) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(category);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}
categoriesCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.findOneAndDelete({ _id: id, user: req.userId });
        if(!category) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(category);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

categoriesCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.findOne({ _id: id, user: req.userId });
        if(!category) {
            return res.status.json({ error: 'record not found' });
        }
        res.json(category);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
}

module.exports = categoriesCtlr;
