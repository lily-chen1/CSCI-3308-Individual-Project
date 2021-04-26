var express = require("express"); //Ensure our express framework has been added
var app = express();
var bodyParser = require("body-parser"); //Ensure our body-parser tool has been added
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var pgp = require('pg-promise')();
//Create Database Connection
const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};


const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
	pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

let db = pgp(dbConfig);
module.exports.db = db;

process.on("uncaughtException", function (err) {
  console.log(err);
});

app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/")); //This line is necessary for us to use relative paths and access our resources directory

app.get("/", function (req, res) {
  res.render("pages/main", {
    local_css: "main.css",
    my_title: "Home Page",
  });
});

app.get("/reviews", function (req, res) {
  console.log(req.query);
  let query;
  if (Object.keys(req.query).length == 0) {
    query = "SELECT * FROM reviews;";
  } else {
    query = `SELECT * FROM reviews WHERE meal='${req.query.meal}';`;
  }
  db.task("/reviews", (task) => {
    return task.batch([task.any(query)]);
  })
    .then((data) => {
      res.render("pages/reviews", {
        local_css: "reviews.css",
        my_title: "Home Page",
        data,
      });
    })
    .catch((err) => {
      console.log("error", err);
      res.render("pages/reviews", {
        local_css: "reviews.css",
        my_title: "Home Page",
        data: "",
      });
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
      res.redirect("/reviews");
    })
    .catch((err) => {
      console.log("error", err);
    });
});

module.exports.server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
