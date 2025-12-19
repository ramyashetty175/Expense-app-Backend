const express = require('express');
const cors = require('cors');
//read the contents of the .env file and add it to the process.env
require('dotenv').config();
//console.log(process.env);
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3050;

const configureDB = require('./config/db');
configureDB();

const usersCtlr = require('./app/controllers/user-Authcontroller');
const authenticateUser = require('./app/middlewares/authenticateUser');
const categoriesCtlr = require('./app/controllers/categories-controller');
const expensesCtlr = require('./app/controllers/expenses-controller');
const authorizeUser = require('./app/middlewares/authorizeUser');

//public route
app.post('/users/register', usersCtlr.register);
app.post('/users/login', usersCtlr.login);

//private route
app.get('/users', authenticateUser, authorizeUser(['admin','moderator']), usersCtlr.list);
app.delete('/users/:id', authenticateUser, authorizeUser(['admin']), usersCtlr.remove);
app.get('/users/account', authenticateUser, usersCtlr.account);
app.put('/users/updatepassword', authenticateUser, usersCtlr.updatepassword);
app.post('/api/categories', authenticateUser, categoriesCtlr.create);
app.get('/api/categories', authenticateUser, categoriesCtlr.list);
app.put('/api/categories/:id', authenticateUser, categoriesCtlr.update);
app.delete('/api/categories/:id', authenticateUser, categoriesCtlr.remove);
app.get('/api/expenses/:id', authenticateUser, expensesCtlr.show);

app.post('/api/expenses', authenticateUser, expensesCtlr.create);
app.get('/api/expenses', authenticateUser, authorizeUser(['admin', 'user']), expensesCtlr.list);
app.put('/api/expenses/:id', authenticateUser, expensesCtlr.update);
app.delete('/api/expenses/:id', authenticateUser, authorizeUser(['admin', 'user']), expensesCtlr.remove);
app.get('/api/expenses/:id', authenticateUser, expensesCtlr.show);

app.listen(port, () => {
    console.log("server is running on port "+port);
}) 
