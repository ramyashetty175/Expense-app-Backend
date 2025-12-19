const jwt = require('jsonwebtoken');
const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).json({ error: 'token not provided' });
    }
    try { 
        let tokenData = jwt.verify(token, process.env.JWT_SECRET);
        //console.log('token data', tokenData);
        req.userId = tokenData.userId;
        req.role = tokenData.role;
        next();
    } catch(err) {
        return res.status(401).json({ error: err.message });
    }
}

module.exports = authenticateUser;

//const authenticateUser = (req, res, next) => {
    //const isAuth = false; //token is not valid
    //handle error cases first
    // if(!isAuth) { //if user is not Authenticated
    //     res.status(401).json({ error: "Not Authenticated" });
    // }
    // next();

    // if(isAuth) {
    //     next();
    // } else {
    //     res.status(401).json({ error: "Not Authenticated" });
    // }
//}
