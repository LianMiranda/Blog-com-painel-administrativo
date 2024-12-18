const express = require('express');
const router = express.Router();
const categoryModel = require("../categories/CategoryModel")
const articleModel = require("./ArticleModel")
const slugify = require("slugify")

router.get('/admin/articles', (req, res) => {
    articleModel.findAll({
        include: [{model: categoryModel}] //incluir os dados do tipo categoryModel na busca
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new', (req, res) => {
    categoryModel.findAll().then(categories => {
        res.render('admin/articles/newArticle', {categories: categories})
    })
})

router.post("/articles/save", (req, res) => {
    var title = req.body.articleTitle;
    var body = req.body.body;
    var category = req.body.category;

    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).send("O título do artigo é obrigatório!.");
    }

    articleModel.create({
        title: title,
        slug: slugify(title.toString()),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
})

router.post('/articles/delete', (req,res) => {
    var id = req.body.id;
    if(id){
        if(!isNaN(id)){
            articleModel.destroy({
                where: {id: id}
            }).then(() =>{
                 res.redirect("/admin/articles");
            })
        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    }
})

module.exports = router