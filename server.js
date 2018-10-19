var express = require ("express");
var bodyParser = require ("body-parser");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/news-scraper.js");

app.use(routes);

app.listen(PORT, function() {

  console.log("Server listening on: http://localhost:" + PORT);
});