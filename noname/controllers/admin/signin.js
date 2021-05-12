var r = require('express').Router();;

r.post('/', function (req, res) {
    var b = req.body;
    if(b.user == nn_config.admin.user && b.pass == nn_config.admin.pass){
    req.session.nn_logged = true;
    req.session.nn_user = b;
    res.redirect('/nn-admin');
    }else{
    res.redirect('/nn-admin');
    }
});


r.get('/nn-logout', function (req, res) {
    req.session.nn_logged = false;
    res.redirect('/');
});

module.exports = r;