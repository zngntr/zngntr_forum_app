var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//root route
router.get("/", function(req, res) {
    res.render("landing");
});

// >>------------------AUTH ROUTE---------------------

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            if (err) {
                return res.render("register", { "error": err.message });
            }
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Foruma hoşgeldiniz " + user.username);
            res.redirect("/contents");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login", { message: req.flash("error", "Lütfen  giriş yapınız!") });
});

// handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/contents",
    failureRedirect: "/login"
}), function(req, res) {

});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Başarılı bir şekilde çıkış yaptınız");
    res.redirect("/contents");
});

// <<-------------------------------------------------



module.exports = router;
