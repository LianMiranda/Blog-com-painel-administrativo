const express = require('express');
const router = express.Router();
const userModel = require('./UserModel')

router.get('/admin/users', (req, res) =>{
    res.send('Usuarios')
})

router.get("/admin/users/create", (req, res) =>{
    res.render('admin/users/create.ejs');
})

router.post("/users/create", (req, res) => {
    var email = req.body.email
    var password = req.body.password 

    res.json({email, password});
})

module.exports = router