function AdminAuth(req, res, next){
    if(req.session.user){
        next()
    }else{
        res.redirect("/notAdm");
    }
}

module.exports = AdminAuth