const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const cors = require('cors');

const userRouter = require("./routes/user-routes");
const testRouter = require("./routes/test-routes");
const resultRouter = require("./routes/result-routes");

app.use(express.json());

// Use the CORS handler --------
const allowedOrigins = ['http://localhost:4200', 'https://aayam-star-web-am22e.ondigitalocean.app', 'https://star.aayamcareerinstitute.com'];
const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
}

// Routings -------
app.use("/users", cors(corsOptions), userRouter);
app.use("/test", cors(corsOptions), testRouter);
app.use("/result", cors(corsOptions), resultRouter);

// cron routes ------------------ (Remove once done)
const cronRouter = require("./routes/cron-routes");
app.use("/cron", cors(corsOptions), cronRouter);

// Mongoose connection ----------
const databaseURL = process.env.DATABASE_URL;
const port = process.env.PORT || 5000;
mongoose.connect(
  databaseURL
).then(()=> 
    app.listen(port, ()=>{
        console.log(`connected on ${port}`)
    })
).catch((err)=>{
    console.log("mongoose error:",err);
})

// handle CORS
app.options('*', cors());