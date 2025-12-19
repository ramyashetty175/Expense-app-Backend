const authorizeUser = (roles) => { //wrapper
    return(req, res, next) => {    //middleware function      
        if(roles.includes(req.role)) {
          next();
        }else {
          res.status(403).json({ error: "you are not authorized" });
        }
    }
}
module.exports = authorizeUser;
