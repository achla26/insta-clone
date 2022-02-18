require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

require('./models/user')
require('./models/post')

const route = require("./routes/auth");

app.use(express.json())
app.use(express.urlencoded({extended:false}));

app.use(route);
app.use(require("./routes/post"));

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('connected', () => {
  console.log("connected to mongo");
});

mongoose.connection.on('error', err => {
  console.log(err);
});

const PORT = process.env.PORT||5000;


const middelware = (req,res,next)=>{
console.log('middelware')
next();
}

app.use(middelware)

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})

