var express=require("express");
var router=express.Router();
var User=require("../models/user"); 
var passport=require("passport");

//show landing page
router.get("/",function(req,res){
   res.render("landing.ejs"); 
});




//AUTH ROUTES
//show the register form
router.get("/register",function(req, res) {
   res.render("register.ejs"); 
});

//handle the logic of register
router.post("/register",function(req, res) {
   var newUser=new User({username:req.body.username});
   //use the hash to deal with the password(Store name in mongoDB)
   User.register(newUser,req.body.password,function(err,user){
      if(err){
          console.log(err);
          req.flash("Error",err.message);
          res.redirect("/register");
      } 
      passport.authenticate("local")(req,res,function(){
          req.flash("Success","Welcome to be our new user!");
         res.redirect("/campground"); 
      });
   });
   
});
//Login Route
router.get("/login",function(req, res) {
    res.render("login.ejs");
});
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campground",
    failureRedirect:"/login"
}),function(req, res) {
    
});

router.get("/logout",function(req, res) {
   req.logout();
   req.flash("Success","Log you out!");
   res.redirect("/campground");
});

module.exports=router;