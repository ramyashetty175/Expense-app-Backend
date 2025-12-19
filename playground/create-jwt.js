const jwt = require('jsonwebtoken');

//create token
const tokenData = { id: 1, email: "ramya@123gmail.com" };
const token = jwt.sign(tokenData, 'dct123', { expiresIn: '7d' });
console.log(token);
