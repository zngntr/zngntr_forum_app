var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Content         = require("./models/content"),
    Comment         = require("./models/comment"),
    User            = require("./models/user");
    //seedDB          = require("./seeds");
    
//requring routes
var commentRoutes    = require("./routes/comments"),
    contentRoutes = require("./routes/contents"),
    indexRoutes      = require("./routes/index");
    
mongoose.connect("mongodb://localhost:27017/forum_db_6", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB();


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


// <<-------------------------------------------------

app.use("/", indexRoutes);
app.use("/contents", contentRoutes);
app.use("/contents/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server is running...");
});