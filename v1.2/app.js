var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    BlogContent  = require("./models/all_blog"),
    mongoose    = require("mongoose"),
    Comment     = require("./models/comment");
//    removeEverything      = require("./seeds");

    
mongoose.connect('mongodb://localhost:27017/forum_db', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//removeEverything();


/*
BlogContent.create(
      {
          name: "Burcu Adıvar", 
          image: "https://neilpatel.com/wp-content/uploads/2017/02/blogging.jpg",
          description: "Buraya geilyorrrdhjkhdlshdl :))",
          comments: []
      },
      function(err, blog){
       if(err){
           console.log(err);
       } else {
           console.log("-------Blog oluşturuldu-----------");
           Comment.create({
               text:"ikinci yorum",
               author: "Burcu"
           }, function(err, comment){
               if(err) {
                   console.log(err);
               } else {
                   blog.comments.push(comment);
                   blog.save();
                   console.log(comment);
               }
           });
           console.log(blog);
       }
     });

*/



// >>------------LANDING PAGE------------

app.get("/", function(req, res){
    res.render("landing");
});

//<<-------------------------------------


// >>------------ SHOW PAGE -------------

app.get("/all_contents", function(req, res){
    //Get all blogs from DB
    BlogContent.find({}, function(err, allContents){
        if(err){
            console.log(err);
        } else {
            res.render("index", {contents: allContents});
        }
    });
});

//<<------------------------------------


//>>------ NEW CONTENT POST ROUTE-------

app.post("/all_contents", function(req, res){
   //get data from form and add to contents array
    var name =  req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newContent = {name: name, image: image, description: description};
    
    // create new content and save to DB
    BlogContent.create(newContent, function(err, newlyCreated){
        if(err){
            console.log(err); // will be showing errors on user interface in soon
        } else {
            //redirect to contents page
            res.redirect("/all_contents");
        }
    });
});

//<<-------------------------------------

//>>--- NEW CONTENT CREATING SHOW ROUTE--

app.get("/all_contents/new", function(req, res) {
    res.render("new.ejs");
});

//<<-------------------------------------

//>>--------CONTENT VIEW IN DETAILS BASED ID--------

app.get("/all_contents/:id", function(req, res) {
    // find the post with provided ID
    BlogContent.findById(req.params.id).populate("comments").exec(function(err, foundContent){
       if(err) {
           console.log(err);
       } else {
           // render show template with that post
           console.log(foundContent);
           res.render("show", {contents: foundContent});
       }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running.."); 
}); 