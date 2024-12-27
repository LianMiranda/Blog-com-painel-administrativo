const express = require('express');
const router = express.Router();
const userModel = require('./UserModel')
const bcrypt = require('bcryptjs');
const { where } = require('sequelize'); 
const categoryModel = require('../categories/CategoryModel');
const adminAuth = require("../middlewares/adminAuth")

router.get('/admin/users', adminAuth, (req, res) =>{
    if(!req.session.user){
        res.redirect("/")
    }
    userModel.findAll().then(users => {
        res.render("admin/users/users.ejs", {users: users})
    })
})

router.get("/admin/users/create", (req, res) =>{
    var message = null;
    res.render('admin/users/create.ejs', { message });
})

router.post("/users/create", (req, res) => {
    var email = req.body.email
    var password = req.body.password
    var message = 'Usuário já cadastrado com esse email!';

    userModel.findOne({where: {email: email}}).then(user =>{
        if(!user){
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)

            userModel.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                console.log(err);
            })
        }else{
            res.render('admin/users/create', { message });
        }
    })
})

router.get("/login", (req, res) => {
    var message = null;
    var invalidPasswordMessage = null;
    res.render('admin/users/login', {message, invalidPasswordMessage});
})

router.post("/auth", (req, res) => {
    var email= req.body.email;
    var password = req.body.password;
    var message = 'Email não cadastrado!';
    var invalidPasswordMessage = 'Senha incorreta!';


    userModel.findOne({where: {email: email}}).then(user => {
        if(user){
            var validPassword = bcrypt.compareSync(password, user.password);

            if(validPassword){
                req.session.user ={
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            }else{
                res.render('admin/users/login', { message: null, invalidPasswordMessage});
            }
        }else{
            res.render('admin/users/login', {message, invalidPasswordMessage: null});
        }
    })
});

router.get('/notAdm', (req, res) => {
    categoryModel.findAll().then(categories => {
        res.render('notAdmin', {categories: categories});
    })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/")
})

module.exports = router