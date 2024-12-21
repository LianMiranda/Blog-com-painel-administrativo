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

router.get("/admin/articles/update/:id", (req, res) => {
    var id = req.params.id;
    
    if(isNaN(id)){
        res.redirect("/admin/articles");
    }

    articleModel.findByPk(id).then(article => {
        if(article){
            categoryModel.findAll().then((categories) => {
                res.render("admin/articles/editArticle", {article: article, categories: categories})
            })
        }else{
            res.redirect("/admin/articles");
        }
    }).catch(err => {
        res.redirect("/admin/articles");
    })
})

router.post('/articles/update', (req,res) => {
    var id = req.body.id
    var body = req.body.body
    var title = req.body.title
    var categoryId = req.body.category

    console.log("ID:", id);
    console.log("Title:", title);

    if (!id || !title) {
        return res.status(400).send("ID e título são obrigatórios.");
    }

    articleModel.update({title: title, body: body, slug: slugify(title), categoryId: categoryId}, {
        where:{
            id: id
        }
    }).then(() => {
        res.redirect('/')
    }) .catch((err) => {
            console.error("Erro ao atualizar o artigo:", err);
            res.status(500).send("Erro interno do servidor.");
    });
})


module.exports = router