const jwt = require('jsonwebtoken');

//loading env var 
const pass = require('../config/keys');


//to authorise the user
module.exports = (req ,res, next) => {
    try{
        const token = req.headers["authorization"].split(" ")[1];
        const decode = jwt.verify(token, pass.jwtPass)
        console.log(decode);
        res.locals.decode = decode;
        next();
    }
    catch (err){
        return res.json({
            status:401,
            message:`user not authorised`
        });
    }
}