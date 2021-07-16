// just to test jwt, making routes private
const router = require('express').Router();
const verify = require('../verifyToken');

router.get('/',verify,(req,res) => {
    res.json({
        posts:{
            title:'my first post',
            description :'random data u shouldnt access'
        }
    });
});

module.exports =  router;