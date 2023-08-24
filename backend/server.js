const express = require('express');
const dbConnect = require ('./database/index');
const {PORT} = require ('./config/index');
const router =  require ('./routes/index');
const errorhandle = require ('./middleware/errorhandle');
const cookie = require ('cookie-parser');
const app = express ();

const cors= require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
    credentials: true,
    origin:['http://localhost:3000'] ,

};

//const PORT = PORT;
app.use(cookieParser());

app.use(cors(corsOptions));

app.use(express.json({limit:'50mb'}));

app.use (router);

dbConnect();

app.use ('/storage' , express.static('storage')); //using this middleware we can access our APIs

app.use (errorhandle); //error handling written in last

app.get('/' , (req,res) => res.json({msg: 'Hello World123456789!'}));

app.listen(PORT, console.log('Backend is running on port: ' + PORT));


