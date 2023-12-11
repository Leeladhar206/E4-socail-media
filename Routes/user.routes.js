const express= require('express');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
const { UserModel } = require('../model/user.model');
const { BlackListModel } = require('../model/blacklist.model');

const userRouter= express.Router();


userRouter.post('/register', async(req,res)=>{

    const {email,password}= req.body;

    try {

        const existinguser= await UserModel.findOne({email});

        if(existinguser){
            return res.status(200).send({"msg":"User is already Registered!"});
        }

        bcrypt.hash(password, 7, async(err, result)=>{
            if(err){
            return res.status(200).send({"hash error":err.message});
            }

            req.body.password= result;

            const newUser= new UserModel(req.body);
            await newUser.save();

            res.status(200).send({"msg":"New User has been registered", newUser})
        })
        
    }catch(error) {
        res.status(400).send({"get error": error.message});
    }
});


userRouter.post('/login', async(req,res)=>{

    const {email,password}= req.body;

    try {
        
        const existinguser= await UserModel.findOne({email});

        if(!existinguser){
            return res.status(200).send({"msg":"Please register to login!"});
        }

        bcrypt.compare(password, existinguser.password, (err, result)=>{

            if(!result){
                return res.status(200).send({"compare error":err.message}); 
            }

            const token= jwt.sign({userId: existinguser._id}, process.env.KEY, { expiresIn: '1d'});

            if(token){
                return res.status(200).send({"msg":"Login Successful", token});
            }
        })

    }catch(error){
        return res.status(400).send({"login error":error.message});
    }
});

userRouter.get('/logout', async(req,res)=>{

    const token= req.headers.authorization?.split(' ')[1] || null;

    try {
     
        if(token){
            const loggedOut= await BlackListModel.updateOne({}, {$addToSet: {blackList: token}},{
                upsert:true
            });

            res.status(200).send({"msg":"LoggedOut Successfully", loggedOut});
        }
        
    }catch(error){
        res.status(400).send({"logout error":error.message});
    }

})


module.exports= {userRouter};