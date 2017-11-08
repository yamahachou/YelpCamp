var mongoose  =require("mongoose");
var Campground=require("./models/campgrounds");
var Comment   =require("./models/comment");

var data=[{
     name:"Snow Mountain",
     image:"https://farm9.staticflickr.com/8086/8500579154_5350408dc9.jpg",
     description:"This is gorgeous"
    },{
      name:"Cloud Mountain",
      image:"https://farm4.staticflickr.com/3009/2522648456_221e15ef70.jpg",
      description:"This is beautiful"
    },{
        name:"Gracious Mountain",
        image:"https://farm6.staticflickr.com/5592/15042544469_822cf0bc98.jpg",
        description:"This is fantastic"
    }];

function seedDB(){
Campground.remove({},function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Data is removed!");
        for(var i=0;i<data.length;i++){
    //campground.create(data<--the information you want to pass in!)
        Campground.create(data[i],function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            console.log("Add new data");
            Comment.create({
                text:"This place is great,but too many noise",
                author:"Porzingod"
            },function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save();
                    console.log("Create new comment!");
                }
            })
        }
    });
  }
    }
});


}

module.exports=seedDB;
