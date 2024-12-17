const express = require('express');
const Category = require('./CategoryModel');
const router = express.Router();
const slugify = require('slugify');
const { where } = require('sequelize');

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
            res.redirect("/admin/categories")
        })
    }
})

router.post("/categories/delete", (req, res) => {
    var id = req.body.id;

    if(id){
        if(!isNaN(id)){
            Category.destroy({
                where:{
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            })
        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {
        if(category){
            res.render("admin/categories/editCategory", {category: category})
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(err => {
        res.redirect("/admin/categories");
    })
})

router.post('/categories/update', (req,res) => {
    var id = req.body.id
    var category = req.body.category

    Category.update({title: category,slug: slugify(category)}, {
        where:{
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

router.get('/admin/categories', (req, res) =>{
    Category.findAll().then(categories => {
        
        res.render('../views/admin/categories/index.ejs', {categories: categories})
    })

})
module.exports = router