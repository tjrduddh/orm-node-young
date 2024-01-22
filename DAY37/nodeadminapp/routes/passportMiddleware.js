//로그인 인증여부
exports.isLoggedIn = (req, res, next) => {

    if(req.isAuthenticated()){

        next();

    } else {

        res.redirect('/login');

    }
};


exports.isNotLoggedIn = (req, res, next) => {

    if(req.isAuthenticated()){

        next();

    } else {

        res.redirect('/');

    }
};