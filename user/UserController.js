const express = require('express');
const router = express.Router();
const userModel = require('./UserModel')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) =>{
    res.send('Usuarios')
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
            res.render('admin/users/create.ejs', { message });
        }
    })
})

module.exports = router