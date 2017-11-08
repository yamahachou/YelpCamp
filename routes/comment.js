var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment"); 
var middleware=require("../middleware");

//show form of adding new comment
router.get("/campground/:id/comments/new",middleware.isLoggedIn,function(req, res) {
   Campground.findById(req.params.id,function(err,campground){
      if(err){
          console.log(err);
      } 
      else{
          res.render("comment/new.ejs",{campground:campground});
      }
   }); 
});

//handle the logic of creating new comment
router.post("/campground/:id/comments",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds/:id");
        }
        else{
            Comment.create(req.body.comment,function(err,comment){
            //   comment.author.id=req.user._id;
            //   comment.author.username=req.user.name;
            //   comment.save();
             
               //console.log("req.user.username is " + req.user.username);
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               //console.log("COMMENT user IS "+ comment.author.username);
               campground.comments.push(comment);
               campground.save();
               res.redirect("/campground/"+ campground._id);
            });
         }
    });
    
});

router.get("/campground/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err, foundcomment) {
       if(err){
           console.log("Error happen while find comment ID");
           console.log(err);
           res.redirect("back");
       }else{
           res.render("comment/edit.ejs",{campground_id:req.params.id, comment:foundcomment});
       }
    });
});

router.put("/campground/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatecomment){
      if(err){
          console.log("error happen while updating the comment");
          console.log(err);
          res.redirect("back");
      }else{
          res.redirect("/campground/"+req.params.id);
      } 
    });
   // res.send("It's the put route!");
});

//comment delete
router.delete("/campground/:id/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id,function(err){
       if(err){
           res.redirect("back");
       }
       else{
           req.flash("Success","You already deleted the comment");
           res.redirect("/campground/"+req.params.id);
       }
   })
});

//Make sure whether user is logged or not(Middleware)




module.exports=router