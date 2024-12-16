const Sequelize = require('sequelize');
const connection = require('../database/database')
const Category = require('../categories/CategoryModel')

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false,
    }, slug:{
        type: Sequelize.STRING,
        allowNull: false
    }, 
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article) ////Metodo hasMany() é para criar um relacionamento 1-p-n
Article.belongsTo(Category) //Metodo belongsTo() é para criar um relacionamento 1-p-1

module.exports = Article