const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const checklogin = require("../middelware/login");

const Post = mongoose.model("Post")
router.get('/allpost',async (req,res)=>{
    try{
        const post =await Post.find().populate('posted_by',"_id name");
        return res.status(200).json({post});
    }
    catch(err){
        console.log(err)
    }
    

})
router.post('/createpost' ,checklogin, async (req,res)=>{
    const {title,body}=req.body;
    if(!title || !body){
        return res.status(422).json({error:"please add all the fields"});
    }
    try{
        req.user.password = undefined;
        const post = new Post({title,body,posted_by:req.user });
        await post.save();
        return res.status(200).json({message:"sucessfully added."});
    }
    catch(err){
        console.log(err)
    }
    
})

router.get('/mypost',checklogin,async (req,res)=>{
    try{
        const post =await Post.find({posted_by : req.user._id}).populate('posted_by',"_id name");
        return res.status(200).json({post});
    }
    catch(err){
        console.log(err)
    }
    

})

module.exports = router;