const express = require('express');
const router = express.Router();
const categoryModel = require("../categories/CategoryModel")
const articleModel = require("./ArticleModel")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")


router.get('/admin/articles', adminAuth,(req, res) => {
    articleModel.findAll({
        include: [{model: categoryModel}] //incluir os dados do tipo categoryModel na busca
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles})
    })
})

router.get('/admin/articles/new', adminAuth,(req, res) => {
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

router.get("/admin/articles/update/:id", adminAuth, (req, res) => {
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
    var category = req.body.category

    console.log("ID:", id);
    console.log("Title:", title);

    if (!id || !title) {
        return res.status(400).send("ID e título são obrigatórios.");
    }

    articleModel.update({title: title, body: body, slug: slugify(title), categoryId: category}, {
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

//sistema de paginação
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num
    var offset =  0

    if(isNaN(page) || page == 1){
        offset = 0
    }else {
        offset = (parseInt(page) - 1) * 4;
    }

    articleModel.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[["createdAt", "DESC"]],
    }).then(articles => {

        var next; // verifica se a outra pagina a ser exibida no sistema de paginação

        if(offset + 4 >= articles.count){
            next = false;
        }else {
            next = true;
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles:articles
        }

        categoryModel.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories: categories})
        })
    })
})
module.exports = router