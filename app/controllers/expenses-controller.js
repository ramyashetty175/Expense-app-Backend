const Expense = require('../models/expense-model');
const expenseValidationSchema = require('../validations/expense-validation');

const expensesCtlr = {};

expensesCtlr.create = async(req, res) => {
    const body = req.body;
    const { error, value } = expenseValidationSchema.validate(body, { abortEarly: false });
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const expenseInDB = await Expense.findOne({ title: value.title, user: req.userId });
        if(expenseInDB) {
            return res.status(400).json({ error: 'record already created' });
        }
        const expense = new Expense(value);
        expense.user = req.userId;
        await expense.save();
        // const expensePopulated = await Expense.findById(expense._id).populate('category', ['_id', 'name'])
        // res.json(expensePopulated);
           // const category = await Category.findById(expense.category);
           // const newExp = { ...expense, category: {}}
           // res.json(newExp);
        res.json(expense);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

expensesCtlr.list = async(req, res) => {
    try {
        //const expenses = await Expense.find({ user: req.userId });
        //if(!expenses) {
            //return res.status(404).json({ error: 'record not found' });
        //}
        //res.json(expenses);
        let expenses;
        if(req.role == 'admin') {
           expenses = await Expense.find();
        }else{
           expenses = await Expense.find({ user: req.userId });
        }
        res.json(expenses);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

expensesCtlr.update = async(req, res) => {
    const body = req.body;
    const id = req.params.id;
    const{ error, value } = expenseValidationSchema.validate(body);
    if(error) {
        return res.status(400).json({ error: error.details });
    }
    try {
        const expense = await Expense.findOneAndUpdate({ _id: id, user: req.userId }, value, { new: true });
        if(!expense) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(expense);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

expensesCtlr.remove = async(req, res) => {
    const id = req.params.id;
    try {
        let expense;
        if(req.role == 'admin') {
            expense = await Expense.findByIdAndDelete(id);
        }else {
            expense = await Expense.findOneAndDelete({ _id: id, user: req.userId });
        }
        //const expense = await Expense.findOneAndDelete({ _id: id, user: req.userId });
        // if(!expense) {
        //    return res.status(404).json({ error: 'record not found' });
        // }
        res.json(expense);
    }catch(err) {
        console.log(err);
        res.status(500).json({ error: 'Something went wrong!!!' });
    }
}

expensesCtlr.show = async(req, res) => {
    const id = req.params.id;
    try {
        const expense = await Expense.findOne({ _id: id, user: req.userId });
        if(!expense) {
            return res.status(404).json({ error: 'record not found' });
        }
        res.json(expense);
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
}

module.exports = expensesCtlr;
