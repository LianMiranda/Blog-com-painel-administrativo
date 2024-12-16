const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const connection = require('./database/database');

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController")

const CategoryModel = require("./categories/CategoryModel")
const ArticleModel = require("./articles/ArticleModel")

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
    res.render("index");
});

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000");
});