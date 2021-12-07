global.custom_env = require('./settings/env.js'); 
global.__workdir = __dirname;

const express = require('express');
const app = express();
const path= require('path');

const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");   // token handling

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send("hi~");
});


const usersRoute = require('./services/users/route')(app);
app.use('/api/users', usersRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`Server Running at ${port}`)
  });