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
    const user = req.session.user; 

    articleModel.findAll({
        order:[["createdAt", "DESC"]],
        limit: 4
    }).then((articles) =>{
        categoryModel.findAll().then((categories) => {
            res.render("home", {articles: articles, categories: categories, user: user});
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
        if(article){
            categoryModel.findAll().then(categories => {
                userModel.findOne({where:{ id: article.userId}}).then(user =>{
                    res.render("article", {article: article, categories: categories,user: user});
                })
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
    var user = req.session.user; 

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
                res.render("home", {articles: category.articles, categories: categories, user: user})
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