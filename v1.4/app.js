var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Content  = require("./models/content"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");
    
mongoose.connect("mongodb://localhost:27017/forum_db_4", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

// >>------------INDEX - show all contents------------

app.get("/contents", function(req, res){
    // Get all contents from DB
    Content.find({}, function(err, allContents){
       if(err){
           console.log(err);
       } else {
          res.render("contents/index",{contents:allContents});
       }
    });
});

// <<-------------------------------------------------


// >>---------CREATE - add new content to DB----------

app.post("/contents", function(req, res){
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

app.get("/contents/new", function(req, res){
   res.render("contents/new"); 
});

// <<-------------------------------------------------


// >>----SHOW - shows more info about one content-----
app.get("/contents/:id", function(req, res){
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



// >>-------------- COMMENTS ROUTES ------------------


app.get("/contents/:id/comments/new", function(req, res){
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


// --------------- COMMENT POST ROUTE ----------------

app.post("/contents/:id/comments", function(req, res){
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

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server is running...");
});