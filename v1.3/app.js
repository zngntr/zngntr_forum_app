var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    BlogContent  = require("./models/content"),
    mongoose    = require("mongoose"),
    Comment     = require("./models/comment");
//    removeEverything      = require("./seeds");

    
mongoose.connect('mongodb://localhost:27017/forum_db_3', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//removeEverything();



/*BlogContent.create(
      {
          name: "Burcu Adıvar", 
          image: "https://neilpatel.com/wp-content/uploads/2017/02/blogging.jpg",
          description: "açıklama kısmı",
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
     });*/





// >>------------LANDING PAGE------------

app.get("/", function(req, res){
    res.render("landing");
});

//<<-------------------------------------


// >>------------ INDEX PAGE -------------

app.get("/all_contents", function(req, res){
    //Get all blogs from DB
    BlogContent.find({}, function(err, allContents){
        if(err){
            console.log(err);
        } else {
            res.render("contents/index", {contents: allContents});
        }
    });
});

//<<------------------------------------


//>>------CREATE NEW CONTENT POST ROUTE-------

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
    res.render("contents/new");
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
          res.render("contents/show", {content: foundContent});
      }
    });
    
});

//>>-----------------COMMENTS ROUTE----------------

app.get("/all_contents/:id/comments/new", function(req, res) {
    // find content by id
    BlogContent.findById(req.params.id, function(err, content){
       if(err) {
           console.log(err);
       } else {
           res.render("comments/new", {content: content});
       }
    });
});


app.post("/all_contents/:id/comments", function(req, res) {
    // lookup content using ID
    BlogContent.findById(req.params.id, function(err, content) {
        if(err) {
            console.log(err);
            res.redirect("/all_contents");
        } else {
            // create new comment
            Comment.create(req.params.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    // connect new comment to content
                    content.comments.push(comment);
                    content.save();
                    // redirect content show page
                    res.redirect("/all_contents/"+ content._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is running.."); 
}); 