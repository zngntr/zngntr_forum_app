var mongoose     = require("mongoose"),
    BlogContent  = require("./models/all_blog"),
    Comment      = require("./models/comment");
    
    
function removeEverything (){
    BlogContent.remove({}, function(err){
       if(err) {
           console.log(err);
       }
       console.log("Bloglar silindi");
       Comment.remove({}, function(err){
           if(err) {
               console.log(err);
           }
           console.log("Yorumlar silindi");
       });
    });
}

module.exports= removeEverything();