global.custom_env = require('./environment/env.js'); 
global.__workdir = __dirname;

const express = require('express');
const app = express();
const path= require('path');
const cors = require("cors");

const whitelist = global.custom_env.API_SERVER.cors_whitelist;
const corsOptions = {
    origin: function (origin, callback) {

      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed Origin!"));
      }
    },
  };
  
  app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");   // token handling

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send("hi~");
});


const usersRoute = require('./services/users/route')(app);
const awsRoute = require('./services/aws/route')(app);
const plansRoute = require('./services/plans/route')(app);
const historyRoute = require('./services/history/route')(app);

app.use('/api/users', usersRoute);
app.use('/api/plans', plansRoute);
app.use('/api/aws',  awsRoute);
app.use('/api/history', historyRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`Server Running at ${port}`)
  });