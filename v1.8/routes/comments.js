var express = require("express");
var router  = express.Router({mergeParams: true}); //merge comment id and exist link
var Content = require("../models/content");
var Comment = require("../models/comment");

// >>-------------- COMMENTS NEW ------------------


router.get("/new", isLoggedIn, function(req, res){
    // find content by id
    Content.findById(req.params.id, function(err, content){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {content: content});
        }
    });
});

// <<-------------------------------------------------


// ------------ COMMENT CREATE and POST --------------

router.post("/", isLoggedIn, function(req, res){
   //lookup content using ID
   Content.findById(req.params.id, function(err, content){
       if(err){
           console.log(err);
           res.redirect("/contents");
       } else {
           //create new comment
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               // add username and ID to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               
               //save comment
               comment.save();
               
               //connect new comment to content
               content.comments.push(comment);
               content.save();
               
               //redirect content show page
               res.redirect("/contents/" + content._id);
           }
        });
       }
   });
});

// <<-------------------------------------------------


// >>---------------- MIDDLEWARE ---------------------

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

// <<-------------------------------------------------

module.exports = router;