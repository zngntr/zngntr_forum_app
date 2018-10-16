var Content = require("../models/content");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkContentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Content.findById(req.params.id, function(err, foundContent) {
            if (err) {
                res.redirect("/contents");
            }
            else {
                // does user own content?
                if (foundContent.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("/contents");
            }
            else {
                // does user own comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
};


middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};



module.exports = middlewareObj;
