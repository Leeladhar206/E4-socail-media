const { BlackListModel } = require("../model/blacklist.model");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware= async(req,res,next)=>{

    const token= req.headers.authorization?.split(' ')[1] || null;

    try {
     
        if(!token){
            return res.status(200).send({"msg":"Please login!"});
        }

        const blackListToken= await BlackListModel.findOne({blackList:{$in : token}});
        if(blackListToken){
           return res.status(200).send({"msg":"Please login!"});
        }

        jwt.verify(token, process.env.KEY, (err,result)=>{

            if(result){
                req.body.userId= result.userId;
                console.log(result)
                return next();
            }else{
                return res.status(200).send({"msg":"Please login!"}); 
            }

        })
 
    }catch(error) {
        return res.status(400).send({"Auth error":error.message});
    }
};

module.exports= {authMiddleware};