var mongoose = require("mongoose");
var Content = require("./models/content");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Varlık ve Yokluk Arasında", 
        image: "https://www.theaccessgroup.com/media/17985/blog-intro.jpg",
        description: "Ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan."
    },
    {
        name: "Mavinin Büyüsü", 
        image: "https://image.freepik.com/free-vector/blogging-background-with-elements-in-flat-design_23-2147559818.jpg",
        description: "Id diam vel quam elementum. Cursus risus at ultrices mi tempus imperdiet nulla malesuada. Lorem donec massa sapien faucibus et. Ut pharetra sit amet aliquam id diam maecenas. Bibendum arcu vitae elementum curabitur vitae nunc sed velit."
    },
    {
        name: "Derin Bir Fyort", 
        image: "https://congdongdigitalmarketing.com/wp-content/uploads/2017/09/Content-viral-696x374.jpg",
        description: "Aliquam vestibulum"
    }
]

function seedDB(){
   //Remove all contents
   Content.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed contents!");
         //add a few contents
        data.forEach(function(seed){
            Content.create(seed, function(err, content){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a content");
                    //create a comment
                    Comment.create(
                        {
                            text: "Quisque non tellus orci ac auctor augue. Ut placerat orci nulla pellentesque dignissim enim.",
                            author: "Halil Zengin"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                content.comments.push(comment);
                                content.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
}

module.exports = seedDB;
