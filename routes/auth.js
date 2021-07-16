const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');

router.post('/register', async(req,res)=> {

    //validate data before saving user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check if user already in db
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);


    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
         const savedUser = await user.save();
        res.send({user : user._id});
    }catch(err){
        res.status(400).send(err);
    }
});


//Login
router.post('/login', async(req,res)=> {

    //validate data before saving user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check if user already in db
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send('Email is not found');

    //if passwird is correct
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //create and assign token
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
})

module.exports =  router;