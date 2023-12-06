require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOVerride = require("method-override");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
app.use(express.json());
const port = 5000;

app.use(express.static("public"));
//templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOVerride("_method"));

app.use(
  session({
    secret: "cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/", require("./server/routes/router"));
app.use("/", require("./server/routes/admin"));

app.listen(port, () => {
  console.log(`Listening on ${port}`);
  console.log("checking");
});
