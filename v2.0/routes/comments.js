var express = require("express");
var router = express.Router({ mergeParams: true }); //merge comment id and exist link
var Content = require("../models/content");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// >>-------------- COMMENTS NEW ------------------


router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find content by id
    Content.findById(req.params.id, function(err, content) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", { content: content });
        }
    });
});

// <<-------------------------------------------------


// ------------ COMMENT CREATE and POST --------------

router.post("/", middleware.isLoggedIn, function(req, res) {
    //lookup content using ID
    Content.findById(req.params.id, function(err, content) {
        if (err) {
            console.log(err);
            res.redirect("/contents");
        }
        else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Birşeyler yanlış gitti");
                    console.log(err);
                }
                else {
                    // add username and ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    //save comment
                    comment.save();

                    //connect new comment to content
                    content.comments.push(comment);
                    content.save();

                    //redirect content show page
                    req.flash("success", "Yorumunuz eklendi");
                    res.redirect("/contents/" + content._id);
                }
            });
        }
    });
});

// <<-------------------------------------------------


// >>--------------- COMMENT EDIT --------------------

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            req.flash("error", "Birşeyler yanlış gitti");
            res.redirect("back");
        }
        else {
            res.render("./comments/edit", { content_id: req.params.id, comment: foundComment });
        }
    });

});

// <<-------------------------------------------------


// >>-------------- COMMENT UPDATE -------------------

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        }
        else {
            req.flash("success", "Yorumunuz düzenlendi");
            res.redirect("/contents/" + req.params.id);
        }
    });
});

// <<-------------------------------------------------


// >>-------------- COMMENT DESTROY ------------------

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            req.flash("error", "Birşeyler yanlış gitti");
            res.redirect("back");
        }
        else {
            req.flash("success", "Yorumunuz silindi");
            res.redirect("/contents/" + req.params.id);
        }
    });
});

// <<-------------------------------------------------



module.exports = router;
