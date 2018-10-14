var express = require("express");
var router  = express.Router();
var Content = require("../models/content");

// >>------------INDEX - show all contents------------

router.get("/", function(req, res){
    // Get all contents from DB
    Content.find({}, function(err, allContents){
       if(err){
           console.log(err);
       } else {
          res.render("contents/index",{contents: allContents/*, currentUser: req.user*/});
       }
    });
});

// <<-------------------------------------------------


// >>---------CREATE - add new content to DB----------

router.post("/",isLoggedIn, function(req, res){
    // get data from form and add to contents array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newContent = {name: name, image: image, description: desc};
    // Create a new content and save to DB
    Content.create(newContent, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to contents page
            res.redirect("/contents");
        }
    });
});

// <<-------------------------------------------------


// >>-------NEW - show form to create new content-----

router.get("/new", isLoggedIn, function(req, res){
   res.render("contents/new"); 
});

// <<-------------------------------------------------


// >>----SHOW - shows more info about one content-----
router.get("/:id", function(req, res){
    //find the content with provided ID
    Content.findById(req.params.id).populate("comments").exec(function(err, foundContent){
        if(err){
            console.log(err);
        } else {
            // console.log(foundContent)
            //render show template with that content
            res.render("contents/show", {content: foundContent});
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