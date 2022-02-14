const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const checklogin = require("../middelware/login");

const User = mongoose.model("User")

router.get('/' , (req,res)=>{
    return res.send("hello")
})

router.get('/protect',checklogin,(req,res)=>{
    return res.send("hello")
})

router.post('/signup',async (req,res)=>{
    const {name,email,password}=req.body;
    if(!email || !password  || !name){
        return res.status(422).json({error:"please add all the fields"});
    }
    //using async await
    try{
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(422).json({message:"email already exist"});
        }
        

        const hashPassword = await bcrypt.hash(password,12);
        const user = new User({email,password:hashPassword,name});
        await user.save();
        return res.status(200).json({message:"sucessfully added."});
    }
    catch(err){
        console.log(err)
    }
    

    // const async 
    // User.findOne({email})
    // .then((userExist)=>{
    //     if(userExist){
    //         return res.status(422).json({message:"email already exist"});
    //     }
    //     const user = new User({
    //         email,password,name
    //     })

    //     user.save()
    //     .then((user)=>{
    //         return res.status(200).json({message:"sucessfully added."});
    //     })
    //     .catch(err=>console.log(err))
    // })
    // .catch(err=>console.log(err))
})


router.post('/signin',async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password ){
        return res.status(422).json({error:"please add all the fields"});
    }
    //using async await
    try{
        

        const userExist = await User.findOne({email});
        if(!userExist){
            return res.status(422).json({message:"account not found"});
        }
        const orignalPassword = await bcrypt.compare(password,userExist.password);
        if(orignalPassword){
           const token =await jwt.sign({_id: userExist._id}, process.env.JWT_SECRET) ;
           res.json(token);
            return res.status(200).json({message:"successfully signed in"});
        }else{
            return res.status(422).json({message:"credentials not matched"});
        }

    }
    catch(err){
        console.log(err)
    }
    
})
module.exports = router;