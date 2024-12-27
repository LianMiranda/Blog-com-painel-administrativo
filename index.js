const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require('./database/database');
const session = require('express-session');

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController")
const userController = require("./user/UserController");

const categoryModel = require("./categories/CategoryModel")
const articleModel = require("./articles/ArticleModel")
const userModel = require("./user/UserModel")


//View engine 
app.set('view engine', 'ejs');


//Session '
app.use(session({
    secret: "chave-secreta",
    cookie: {maxAge: 30000000}
}))

//Static
app.use(express.static('public'))

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//Database
connection.authenticate().then(() =>{
    console.log('Conexão feita com sucesso');  
}).catch((err) =>{
    console.log("ERRO " + err);
})

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);


//Routes   
app.get("/", (req, res) => {
    articleModel.findAll({
        order:[["createdAt", "DESC"]],
        limit: 4
    }).then((articles) =>{
        categoryModel.findAll().then((categories) => {
            res.render("index", {articles: articles, categories: categories});
        })
    })
});

app.get("/:slug", (req,res) => {
    var slug = req.params.slug;
    articleModel.findOne({
        where:{
            slug:slug
        }
    }).then(article => {
        if(article != undefined){
            categoryModel.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            })
        }else{
            res.redirect("/");
        } 
    }).catch((err) =>{
        res.redirect("/")
    })
})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;

    categoryModel.findOne({
        where:{
           slug: slug
        }, 
        include:[
            {model: articleModel} //incluindo artigos q fazem parte da categoria
        ]
    }).then(category =>{
        if(category){
            categoryModel.findAll().then(categories =>{
                res.render("index", {articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})
app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000");
});