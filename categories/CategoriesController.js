const express = require('express');
const Category = require('./CategoryModel');
const router = express.Router();
const slugify = require('slugify')

router.get("/admin/categories/new", (req, res) => {
    res.render('admin/categories/newCategory')
});

router.post("/categories/save", (req, res) => {
    var category = req.body.category

    if(!category){
        return res.status(400).send('O campo de categoria é obrigatório!');
    }else{
        Category.create({
            title: category,
            slug: slugify(category)
        }).then(() => {
            res.redirect("/")
        })
    }
})

router.get('/admin/categories', (req, res) =>{
    Category.findAll().then(categories => {
        
        res.render('../views/admin/categories/index.ejs', {categories: categories})
    })

})
module.exports = router