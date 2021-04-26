let passwordString = "";
if (!process.env.DATABASE_URL) {
  const { password } = require("./passwords");
  passwordString = password;
}
var express = require("express"); //Ensure our express framework has been added
var app = express();
var bodyParser = require("body-parser"); //Ensure our body-parser tool has been added
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const session = require("express-session");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Create Database Connection
var pgp = require("pg-promise")();
let databaseConfig;
if (process.env.PORT) {
  databaseConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  databaseConfig = `postgresql://postgres:${passwordString}@localhost:5432/postgres`;
}
const db = pgp(databaseConfig);
module.exports.db = db;

process.on("uncaughtException", function (err) {
  console.log(err);
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/")); //This line is necessary for us to use relative paths and access our resources directory

app.get("/", function (req, res) {
  res.render("pages/main", {
    local_css: "main.css",
    my_title: "Home Page",
    loggedin: req.session.loggedin,
    username: req.session.username,
  });
});

app.post("/addReview", async function (req, res) {
  const meal = req.body.meal;
  const review = req.body.review;
  var query = `INSERT INTO reviews(meal, review, review_date) VALUES('${meal}', '${review}', '${Date()}');`;
  await db
    .task("/addReview", (task) => {
      return task.batch([task.any(query)]);
    })
    .then((data) => {
      console.log("success");
    })
    .catch((err) => {
      console.log("error", err);
    });
});

const port = process.env.PORT || 3000;
module.exports.server = app.listen(port, function () {
  console.log("App is running on port " + port);
});
