const express = require('express');
const dbConnect = require ('./database/index');
const {PORT} = require ('./config/index');
const router =  require ('./routes/index');
const errorhandle = require ('./middleware/errorhandle');
const cookie = require ('cookie-parser');
const app = express ();

//const PORT = PORT;
app.use(cookie());

app.use(express.json());

app.use (router);

dbConnect();

app.use ('/storage' , express.static('storage')); //using this middleware we can access our APIs

app.use (errorhandle); //error handling written in last

app.get('/' , (req,res) => res.json({msg: 'Hello World123456789!'}));

app.listen(PORT, console.log('Backend is running on port: ' + PORT));


