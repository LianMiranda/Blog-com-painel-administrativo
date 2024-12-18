const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require('./database/database');

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController")

const categoryModel = require("./categories/CategoryModel")
const articleModel = require("./articles/ArticleModel")

//View engine 
app.set('view engine', 'ejs');

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

//Routes   
app.get("/", (req, res) => {
    articleModel.findAll().then((articles) =>{
        res.render("index", {articles: articles});
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
          res.render("article", {article: article});
        }else{
            res.redirect("/");
        } 
    }).catch((err) =>{
        res.redirect("/")
    })
})

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000");
});