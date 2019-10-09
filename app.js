var PORT = process.env.PORT || 27017;
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

// REQUIRING ROUTES
var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/yelp_camp_version13", {
//   useNewUrlParser: true
// });
mongoose
  .connect(
    "mongodb+srv://me:howcani55@cluster0-rkjxu.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(err => {
    console.log("ERROR: ", err.message);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "We will think about letting you in",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ADDS CURRENT USER INFORMATION TO EACH ROUTE SO NAV SHOWS APPROPRIATE LINKS ACCORDING TO WHETHER USER IS LOGGED IN OR NOT
// AND
// ADDS A FLASH MESSAGE TO EACH PAGE IF THERE IS ONE TO BE DISPLAYED
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, function() {
  console.log("The YelpCamp Server has started");
});
