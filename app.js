require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const session = require("express-session");
const connecDB = require("./src/config/db");
const { isActiveRoute } = require("./src/helpers/routeHelpers");

const app = express();
const PORT = 5000 || process.env.PORT;

// Connection à la base de données
connecDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "Keyboard car",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    //cookie:{maxAge:new Date (Date.now() + (3600000))}
  })
);

app.use(express.static("public"));

// Templating engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute;

app.use("/", require("./src/routes/main"));
app.use("/", require("./src/routes/admin"));

app.listen(PORT, () => {
  console.log("L'application démarre sur le port " + PORT);
});
