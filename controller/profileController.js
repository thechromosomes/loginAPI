//fetching database model
const db = require('../models/User');


//POST to post the user information
module.exports.post = (req, res) => {
    let query = 'INSERT INTO profile SET ?';
    let profile = {
        "user_name": req.body.user_name,
        "dob":req.body.dob,
        "address": req.body.address,
        "link1": req.body.link1,
        "link2": req.body.link2,
        "link3": req.body.link3,
        "user_id":res.locals.decode.id
    }
    
    db.query(query, profile, (err, rows, fields) => {
        if(!err){

            res.json({
                status: 200,
                message: "you just sucessfully inserted into the profile"
            })
        }
        else{
            res.json({
                staus:400,
                message:'there is some problem',
                error:err
            })
            }
        });
}


//to fetch the profile of a user
module.exports.fetch = (req, res) => {
    let query = 'SELECT * FROM profile WHERE user_id = ?';
    db.query(query, [res.locals.decode.id], (err, rows, fields) => {
        if(err){
            res.json({
                staus:400,
                message:'there is some problem',
                error:err
            })
        }
        else if (rows.length===0){
            res.json({
                staus:404,
                message:'User Not found',
                error:err
            })
        }
        else{
            res.json({
                status:200,
                message:'sucessfully data fetched',
                data: rows,
            })
        }
    });
}

// to update the user profile 
module.exports.update = (req,res) => {
    allowedKeys=["user_name","dob","address","link1","link2","link3"]
    let profile ={}; 
    Object.keys(req.body).forEach(e=>{
        if(allowedKeys.indexOf(e) > -1 && req.body[e])
        profile[e]=req.body[e];
    });
    let id = res.locals.decode.id;
    let query = `UPDATE profile SET ? WHERE user_id = ${id}`
    db.query(query, [profile], (err, rows, result) => {
        if(!err){
            res.json({
                message:`updated sucessfully`,
                status:200,
            })
        }
        else{
            res.json({
                message:`there is some problem with query`,
                status:400,
                error:err
            })
        }
    });
}

// to delete the profile data 
module.exports.delete =  (req, res) =>{
    let id = res.locals.decode.id;
    let query = `DELETE FROM profile WHERE user_id =${id}`;
    db.query(query, (err, result) => {
        if(!err){
            res.json({
                message:`profile sucessfully deleted`,
                status:200
            })
        }
        else{
            console.log(err);
            res.json({
                message:`there is some problem`,
                status:400
            })
        }
    });
}