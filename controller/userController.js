// reuire module
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//loading env var 
const pass = require('../config/keys');

// Load User model
const db = require('../models/User');


//register controller
module.exports.register = (req, res) => {

  var users={
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "email":req.body.email,
    "pass_key":req.body.password,
    "dob":req.body.dob
}

    //check if email exists
      db.query(`SELECT * FROM users WHERE email = '${users.email}'`, (err, rows, fields) => {
     if(rows.length > 0){
       res.json({
         message:`email already exists`,
         status:409
       })
     }
     else{

    //Joi authentication for registratoin
    const schema = Joi.object().keys({
      first_name: Joi.string().alphanum().min(3).max(25).required(),
      last_name: Joi.string().alphanum().min(3).max(25).required(),
      password: Joi.string(),
      password2:Joi.string().valid(Joi.ref('password')).required(),
      dob:Joi.string().required(),
      email:Joi.string().email({ minDomainAtoms: 2 }).required(),
      mobile:Joi.string()
    });
    Joi.validate(req.body, schema, (err, result) => {
      if(err){
        res.json({
          message:`there is some problem with credentials`,
          status:400,
          errorType: err.name,
          error:err.message
        })
      } 
      else{
        //gentrating encrypted password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(users.pass_key, salt, (err, hash) => {
            if (err) throw err;
            users.pass_key = hash;
        db.query('INSERT INTO users SET ?',users, (err, rows, fields) => {  
          if (err) throw err; 

          //jwt token => temporary
          const token = jwt.sign({
            email:result.email,
            id: result.user_id
          },
           pass.jwtPass, 
           { expiresIn: "1hr" });
             res.json({
               message:`register sucessfully`,
               status:200,
               result:result,
               token:token
             })
            });   
          });
        });
      }
    });
     }
   });
  }


  //logIn controller  
  module.exports.logIn = (req, res) => {
    let email= req.body.email;
    let password = req.body.password;
    db.query('SELECT * FROM users WHERE email = ?',[email], (error, results, fields) => {
if (error) {
  res.send({
    "code":400,
    "failed":"error ocurred"
  })
}else{
  if(results.length >0){

    //check password
    bcrypt.compare(password, results[0].pass_key)
    .then((isMatch) => {
      if(isMatch){
        const token = jwt.sign({
          email:results[0].email,
          id: results[0].user_id
        },
         pass.jwtPass, 
         { expiresIn: "1hr" });
        
        res.json({
          "code":200,
          "success":"login sucessfull",
          token:token
            });
      }
      else{
        res.json({
          message:`password does not match`,
          status:400
        })
      }
      
    });
  }
  else{
    res.send({
      "code":204,
      "message":"Email does not exits"
        });
  }
}
});
}

// DELETE user
module.exports.delete = (req,res) => {
  let remove = 'DELETE FROM users WHERE userid= ?';
  db.query(remove, [req.params.id], (err, rows, filed) => {
    if(!err){
      res.json(`user deleted`); 
    }else
    res.json(`there is some problem ${err}`);
  })
}