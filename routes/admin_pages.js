const { render } = require('ejs');
const express = require('express');
const router = express.Router();

//get Page model
const Page = require('../models/page');

//Get Pages Index
router.get('/', (req,res)=>{
    Page.find({}).sort({sorting: 1}).exec(function(err,pages){
        res.render('admin/pages', {
            pages: pages
        });
    });
});

//Get add Page
router.get('/add-page', (req,res)=>{
    
    const title = '';
    const slug = '';
    const content = '';

    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });
});
//Post and add Page
router.post('/add-page', (req,res)=>{
    
    req.checkBody('title', 'Title must have value.').notEmpty();
    req.checkBody('content', 'Content must have value.').notEmpty();

    const title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    const content = req.body.content;

    const err  = req.validationErrors();

     if(err){
        console.log('err');
         res.render('admin/add_page', {
            err: err,
            title: title,
            slug: slug,
            content: content
        });
     } else {
         Page.findOne({slug: slug}, function(error,page){
            if(error) return console.log(error);

            if(page) {
                req.flash('danger', `Page ${slug.toUpperCase()} exist, choose another name.`)
                res.render('admin/add_page', {
                    err: error,
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                let page = new Page({
                    title: title,
                    slug : slug,
                    content: content,
                    sorting: 100
                });

                page.save(function(err){
                    if(err) return console.log(err);

                    req.flash('success', 'Page Added!');
                    res.redirect('/admin/pages');
                });
            }
         })
     }
});

//POST reorder pages update sorting
router.post('/reorder-pages', (req,res)=>{
    let ids = req.body['id[]'];

    let count = 0;

    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        count++;
        
        (function(count) {//async callback function
            Page.findById(id, (err,page)=>{
                page.sorting = count;
                page.save(function(err) {
                    if(err) {
                        return console.log(err)
                    }
                });
            })
        }) (count);
    }

    console.log(req.body)
});
//Get Edit Page
router.get('/edit-page/:slug', (req,res)=>{
    Page.findOne({slug: req.params.slug}, (err, page)=>{
        if(err) return console.log(err);

        res.render('admin/edit_page', {
            title: page.title,
            slug: page.slug,
            content: page.content,
            id: page._id
        });
    })
});

//Post edited Page
router.post('/edit-page/:slug', (req,res)=>{
    
    req.checkBody('title', 'Title must have value.').notEmpty();
    req.checkBody('content', 'Content must have value.').notEmpty();

    const title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if(slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    const content = req.body.content;
    const id = req.body.id;

    const err  = req.validationErrors();

     if(err){
        console.log('err');
         res.render('admin/edit_page', {
            err: err,
            title: title,
            slug: slug,
            content: content, 
            id: id
        });
     } else {
         Page.findOne({slug: slug, _id:{'$ne':id}}, function(error,page){
            if(error) return console.log(error);

            if(page) {
                req.flash('danger', `Page ${slug.toUpperCase()} exist, choose another name.`)
                res.render('admin/edit_page', {
                    err: error,
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                Page.findById(id, function(err,page){
                    if(err) return console.log(err);

                    page.title = title;
                    page.slug = slug;
                    page.content = content; 

                    page.save(function(err){
                        if(err) return console.log(err);
    
                        req.flash('success', 'Page changes applied succesfully!');
                        res.redirect('/admin/pages/edit-page/' + page.slug);
                    });
                })
            }
         })
     }
});

//Get Delete Page
router.get('/delete-page/:id', (req,res)=>{
    Page.findByIdAndRemove(req.params.id, function(err){
        if(err) return console.log(err);
        req.flash('success', 'Page deleted succesfully!');
        res.redirect('/admin/pages/');
    });
});

//Exports
module.exports = router;