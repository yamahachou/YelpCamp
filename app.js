var express              =require("express");
var app                  =express();
var bodyParser           =require("body-parser");
var mongoose             =require("mongoose");
var Campground           =require("./models/campgrounds");
var seedDB               =require("./seed");
var Comment              =require("./models/comment");
var passport             =require("passport");
var LocalStrategy        =require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var methodOverride       =require("method-override");
var flash                =require("connect-flash");

var User                 =require("./models/user");
//Connect the Routes
var commentRoutes        =require("./routes/comment");
var campgroundRoutes     =require("./routes/campground");
var indexRoutes          =require("./routes/index");


//seedDB();
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect('mongodb://localhost/yelp_camp');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION(This part required furthur study)
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This use can help other page to get the currentUser infromation
app.use(function(req,res,next){
   res.locals.currentUser=req.user;
   res.locals.error=req.flash("Error");
   res.locals.success=req.flash("Success")
   next();
});

app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server is listening!");
});
