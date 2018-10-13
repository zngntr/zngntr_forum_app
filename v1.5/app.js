var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Content         = require("./models/content"),
    Comment         = require("./models/comment"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
mongoose.connect("mongodb://localhost:27017/forum_db_5", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


// >>------------ PASSPORT CONFIGURATION -------------

app.use(require("express-session")({
    secret: "secret of pyramids",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//call function in every route
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.get("/", function(req, res){
    res.render("landing");
});

// <<-------------------------------------------------

// >>------------INDEX - show all contents------------

app.get("/contents", function(req, res){
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

app.post("/contents",isLoggedIn, function(req, res){
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

app.get("/contents/new", isLoggedIn, function(req, res){
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


app.get("/contents/:id/comments/new", isLoggedIn, function(req, res){
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

app.post("/contents/:id/comments", isLoggedIn, function(req, res){
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



// >>------------------AUTH ROUTE---------------------

// show register form
app.get("/register", function(req, res) {
   res.render("register"); 
});

// handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err) {
           console.log(err);
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
           res.redirect("/contents");
       });
    });
});

// show login form
app.get("/login", function(req, res) {
   res.render("login");
});

// handle login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/contents",
    failureRedirect: "/login"
}), function(req, res) {
    
});

// logout route
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/contents");
});

// <<-------------------------------------------------

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server is running...");
});