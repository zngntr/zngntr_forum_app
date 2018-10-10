/*var express     = require("express"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    app         = express();

mongoose.connect("mongodb://localhost/forum_db");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//SCHEMA SETUP
var blogSchema = new mongoose.Schema({
   name: String,
   image: String
}, function(err, blog){
    if(err){ console.log(err);
    } else {
        console.log("----------------Blog oluşturuldu----------------");
        console.log(blog);
    }
});

var BlogContent = mongoose.model("BlogContent", blogSchema);

BlogContent.create({
    name: "Halil Zengin", 
    image: "https://buprof.com/wp-content/uploads/2017/01/opk-online-proficiency-kursu-buprof.jpg"
});
*/

//-----------------------------------
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

Campground.create(
      {
          name: "Granite Hill", 
          image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
          description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
      },
      function(err, campground){
       if(err){
           console.log(err);
       } else {
           console.log("NEWLY CREATED CAMPGROUND: ");
           console.log(campground);
       }
     });

//-----------------------------------



// temprary data for exercise ---------
var contents = [
            {name: "Halil Zengin", image: "https://www.theaccessgroup.com/media/17985/blog-intro.jpg"},
            {name: "Furkan Yıldız", image: "https://image.freepik.com/free-vector/blogging-background-with-elements-in-flat-design_23-2147559818.jpg"},{name: "Halil Zengin", image: "https://www.theaccessgroup.com/media/17985/blog-intro.jpg"},
            {name: "Furkan Yıldız", image: "https://image.freepik.com/free-vector/blogging-background-with-elements-in-flat-design_23-2147559818.jpg"},{name: "Halil Zengin", image: "https://www.theaccessgroup.com/media/17985/blog-intro.jpg"},
            {name: "Furkan Yıldız", image: "https://image.freepik.com/free-vector/blogging-background-with-elements-in-flat-design_23-2147559818.jpg"},{name: "Halil Zengin", image: "https://www.theaccessgroup.com/media/17985/blog-intro.jpg"},
            {name: "Furkan Yıldız", image: "https://image.freepik.com/free-vector/blogging-background-with-elements-in-flat-design_23-2147559818.jpg"},{name: "Halil Zengin", image: "https://www.theaccessgroup.com/media/17985/blog-intro.jpg"},
            {name: "Furkan Yıldız", image: "https://image.freepik.com/free-vector/blogging-background-with-elements-in-flat-design_23-2147559818.jpg"},{name: "Halil Zengin", image: "https://www.theaccessgroup.com/media/17985/blog-intro.jpg"},
            {name: "Furkan Yıldız", image: "https://image.freepik.com/free-vector/blogging-background-with-elements-in-flat-design_23-2147559818.jpg"},{name: "Halil Zengin", image: "https://www.theaccessgroup.com/media/17985/blog-intro.jpg"},
            {name: "Furkan Yıldız", image: "https://image.freepik.com/free-vector/blogging-background-with-elements-in-flat-design_23-2147559818.jpg"},
            {name: "Betty Blur", image: "https://congdongdigitalmarketing.com/wp-content/uploads/2017/09/Content-viral-696x374.jpg"},
            {name: "Betty Blur", image: "https://congdongdigitalmarketing.com/wp-content/uploads/2017/09/Content-viral-696x374.jpg"},
            {name: "Betty Blur", image: "https://congdongdigitalmarketing.com/wp-content/uploads/2017/09/Content-viral-696x374.jpg"},
            {name: "Betty Blur", image: "https://congdongdigitalmarketing.com/wp-content/uploads/2017/09/Content-viral-696x374.jpg"},
            {name: "Betty Blur", image: "https://congdongdigitalmarketing.com/wp-content/uploads/2017/09/Content-viral-696x374.jpg"}
        ];
//--------------------------------------        
        
// landing page
app.get("/", function(req, res){
    res.render("landing");
});


// all contents which has been posted
app.get("/all_contents", function(req, res){
    res.render("all_contents", {contents: contents});
});

// new content POST route
app.post("/all_contents", function(req, res){
   //get data from form and add to contents array
    var name =  req.body.name;
    var image = req.body.image;
    var newContent = {name: name, image: image};
    contents.push(newContent);
    
   //redirect to contents page
   res.redirect("/all_contents");
});

//new content create route
app.get("/all_contents/new", function(req, res) {
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running.."); 
}); 