function AdminAuth(req, res, next){
    if(req.session.user && req.session.user.profileId == 1){
        next()
    }else{
        res.redirect("/notAdm");
    }
}

module.exports = AdminAuth