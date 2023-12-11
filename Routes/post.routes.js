const express= require('express');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { PostModel } = require('../model/post.model');

const postRouter= express.Router();

postRouter.use(authMiddleware);

postRouter.get('/', async(req,res)=>{

    const {device}= req.query;

    try {   
        if(!device){
            const allPosts= await PostModel.find({userId:req.body.userId});
            return res.status(200).send(allPosts);
        }

        const devidePosts= await PostModel.find({$and:{userId:req.body.userId, device:device}});
        return res.status(200).send(devidePosts);

    }catch(error){
        return res.status(400).send({"get error": error.message}); 
    }
});

postRouter.post('/add', async(req,res)=>{

    try {   
        console.log(req.body)
        const newPost= new PostModel(req.body);
        await newPost.save();
        return res.status(200).send({"msg":"New Post added", newPost});

    }catch(error){
        return res.status(400).send({"add error": error.message}); 
    }
});

postRouter.patch('/update/:postId', async(req,res)=>{

    const {postId}= req.params;

    try {   
        // const updatePost= PostModel.findOne({_id:postId});

        // if(req.body.userId===updatePost.userId){

            await PostModel.findByIdAndUpdate({_id:postId},req.body);
            return res.status(200).send({"msg":"Post is Updated"});
        // }else{
        //     return res.status(200).send({"msg":"You are not authorized"});
        // }

    }catch(error){
        return res.status(400).send({"update error": error.message}); 
    }
});

postRouter.delete('/delete/:postId', async(req,res)=>{

    const {postId}= req.params;

    try {   
        // const deletePost= PostModel.findOne({_id:postId});

            await PostModel.findByIdAndDelete({ _id: postId});
            return res.status(200).send({"msg":"Post is Deleted"})

    }catch(error){
        return res.status(400).send({"delete error": error.message}); 
    }
});



module.exports= {postRouter};