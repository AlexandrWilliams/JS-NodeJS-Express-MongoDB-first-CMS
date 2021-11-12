const { render } = require('ejs');
const express = require('express');
const router = express.Router();

//get Category model
const Category = require('../models/category');

//Get Categories Index
router.get('/', (req,res)=>{
    Category.find(function(err,cat){
        if(err) return console.log(err);
        res.render('admin/categories', {
            cats: cat
        });
    });
});

//Get add Category
router.get('/add-category', (req,res)=>{
    
    const title = '';

    res.render('admin/add_category', {
        title: title
    });
});
//Post and add Category
router.post('/add-category', (req,res)=>{
    
    req.checkBody('title', 'Category name must have value.').notEmpty();

    const title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();

    const err  = req.validationErrors();

     if(err){
        console.log('err');
         res.render('admin/add_category', {
            err: err,
            title: title,
            slug: slug
        });
     } else {
         Category.findOne({slug: slug}, function(error,cat){
            if(error) return console.log(error);

            if(cat) {
                req.flash('danger', `Category ${slug.toUpperCase()} exist, choose another name.`)
                res.render('admin/add_category', {
                    err: error,
                    title: title,
                    slug: slug
                });
            } else {
                let newCat = new Category({
                    title: title,
                    slug : slug
                });

                newCat.save(function(err){
                    if(err) return console.log(err);

                    req.flash('success', 'Category Added!');
                    res.redirect('/admin/categories');
                });
            }
         })
     }
});

//Get Edit Category
router.get('/edit-category/:id', (req,res)=>{
    Category.findById(req.params.id, (err, cat)=>{
        if(err) return console.log(err);

        res.render('admin/edit_category', {
            title: cat.title,
            id: cat._id
        });
    })
});

//Post edited category
router.post('/edit-category/:id', (req,res)=>{
    
    req.checkBody('title', 'Title must have value.').notEmpty();

    const title = req.body.title;
    let slug = title.replace(/\s+/g, '-').toLowerCase();
    const id = req.params.id;

    const err  = req.validationErrors();

     if(err){
        console.log('err');
         res.render('admin/category_page', {
            err: err,
            title: title,
            slug: slug,
            id: id
        });
     } else {
         Category.findOne({slug: slug, _id:{'$ne':id}}, function(error,cat){
            if(error) return console.log(error);

            if(cat) {
                req.flash('danger', `Category ${slug.toUpperCase()} exist, choose another name.`)
                res.render('admin/edit_category', {
                    err: error,
                    title: title,
                    slug: slug,
                    id: id
                });
            } else {
                Category.findById(id, function(err,cat){
                    if(err) return console.log(err);

                    cat.title = title;
                    cat.slug = slug;

                    cat.save(function(err){
                        if(err) return console.log(err);
    
                        req.flash('success', 'Category changes applied succesfully!');
                        res.redirect('/admin/categories/edit-category/' + cat.id);
                    });
                })
            }
         })
     }
});

//Get Delete Category
router.get('/delete-category/:id', (req,res)=>{
    Category.findByIdAndRemove(req.params.id, function(err){
        if(err) return console.log(err);
        req.flash('success', 'Category deleted succesfully!');
        res.redirect('/admin/categories/');
    });
});

//Exports
module.exports = router;