var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");
var middlewareObj={};

//checkcampgroundowner
middlewareObj.checkCampgroundOwnership=function (req,res,next){
    //First, check whether you are log in or not
    if(req.isAuthenticated()){
        //Second, check you own this account or not
        Campground.findById(req.params.id,function(err, foundcampground) {
            if(err){
                console.log("It's not log in");
                console.log(err);
                res.render("back");
            }else{
                if(foundcampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("Error","Wrong account, you are not allowed to do that!");
                    console.log("Log in but the account is different");
                    res.redirect("back");
                }
            }
            
        })
    }
    else{
        //go back to the ex page
        res.redirect("back");
    }
}

//checkcommentOwner
middlewareObj.checkCommentOwnership=function (req,res,next){
    //First, check whether you are log in or not
    if(req.isAuthenticated()){
        //Second, check you own this account or not
        Comment.findById(req.params.comment_id,function(err, foundcomment) {
            if(err){
                console.log("It's not log in");
                console.log(err);
                res.render("back");
            }else{
                if(foundcomment.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("Error","Wrong account, you are not allowed to do that!");
                    console.log("Log in but the account is different");
                    res.redirect("back");
                }
            }
            
        })
    }
    else{
        //go back to the ex page
        console.log("Please Sign Up first");
        req.flash("Error","You need to Sign In first");
        res.redirect("back");
    }
}

//isLoggedIn
middlewareObj.isLoggedIn=function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("Error","You need to log in to do next move");
        res.redirect("/login");
    }
}

module.exports=middlewareObj;

