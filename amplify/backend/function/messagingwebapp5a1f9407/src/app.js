var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
// app.use(cors());
const corsOptions = {
  origin: (origin, callback) => {
    console.log("origin: ", origin);
    return callback(null, true);
    // if (constants.allowedCORSOrigins.includes(origin))
    //   return callback(null, true);

    // callback(new Error("Not allowed by CORS"));
  },
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

var indexRouter = require("./routes/index");
var agentsRouter = require("./routes/agents");
var customersRouter = require("./routes/customers");
var queriesRouter = require("./routes/queries");
require("dotenv").config();
require("aws-sdk").config.update({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/agents", agentsRouter);
app.use("/customers", customersRouter);
app.use("/queries", queriesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
                                        // set locals, only providing error in development
                                        // res.locals.message = err.message;
                                        // res.locals.error = req.app.get("env") === "development" ? err : {};

                                        // // render the error page
                                        // res.status(err.status || 500);
                                        // res.render("error");
                                        return res.sendStatus(500);
                                      });

module.exports = app;
