var express=require("express");
var router=express.Router();
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");

//show all campgound
router.get("/campground",function(req,res){
    //Get all cmpground from DB
    
    Campground.find({},function(err,allcampgrounds){ 
        if(err){
            console.log("Something went wrong");
            console.log(err);
        }
        else{
           res.render("campground/index.ejs",{campground:allcampgrounds});
        }
    });
          
});

//add new campground
router.post("/campground",middleware.isLoggedIn,function(req,res){
   //post means that you make a request to add new data
   //In here we are going to get data from form and add to campgrounds array
   //redirect back to campground page
   var name=req.body.name;
   var image=req.body.image;
   var description=req.body.description;
   var price=req.body.price;
//   var author={
//       id:req.user._id,
//       username:req.user.username
//   };
  var newCampground={name:name,image:image,description:description,price:price};
   //pass name and image value into it
   Campground.create(newCampground,function(err,newlyCreated){ // create new campground and save it
      if(err){
          console.log("Wrong in post");
          console.log(err);
      } 
      else{
          newlyCreated.author.id=req.user._id;
          newlyCreated.author.username=req.user.username;
          newlyCreated.save();
          res.redirect("/campground");
      }
   });
});

//NEW-show form to create new campground
router.get("/campground/new",middleware.isLoggedIn,function(req,res){
    //add new campground to "/campground"
    res.render("campground/new.ejs");
});

//Show specific campground
router.get("/campground/:id",function(req, res) {
    //fnd campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
      if(err){
          console.log("It's wrong!");
          console.log(err);
      } 
      else{
          //console.log(foundcampground);
          //console.log("The length is "+ foundcampground.comments.length);
          res.render("campground/show.ejs",{campground:foundcampground});
      }
    });
    
});

//Edit Campground information

router.get("/campground/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundcampground){
            res.render("campground/edit.ejs",{campground:foundcampground});
    });
   
});

router.put("/campground/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatecampground){
      if(err){
          console.log("The campground edit part is error");
          console.log(err);
          res.redirect("/campground");
      }else{
          res.redirect("/campground/"+req.params.id);
      } 
   }); 
});

router.delete("/campground/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           console.log(err);
           res.redirect("/campground/:id");
       }
       else{
           req.flash("Success","You already deleted the campground!");
           res.redirect("/campground");
       }
   }); 
});



module.exports=router;
