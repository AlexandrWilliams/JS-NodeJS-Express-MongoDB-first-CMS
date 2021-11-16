const express = require('express');
const router = express.Router();

//get Page model
const Page = require('../models/page');

//Get /
router.get('/', (req,res)=>{

    Page.findOne({slug: 'home'}, function(err, page){
        if (err) console.log(err);
        res.render('index',{
            title: page.title,
            content: page.content,
            categories: req.app.locals.cats
        });
    })
});

// Get page
router.get('/:slug', (req,res)=>{

    let slug = req.params.slug;

    Page.findOne({slug: slug}, function(err, page){
        if (err) console.log(err);
        if (!page) {
            res.redirect('/');
        } else {
            res.render('index',{
                title: page.title,
                content: page.content
            });
        }
    })
});

//Exports
module.exports = router;