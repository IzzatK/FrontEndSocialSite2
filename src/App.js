
const postRoutes = require('./routes/post')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const express = require('express')
const morgan = require("morgan");
const dotenv = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const fs = require('fs');
var cookieParser = require('cookie-parser')
const expressJwt = require('express-jwt')
const cors = require('cors')

dotenv.config()

//db

mongoose.connect(process.env.MONGO_URI,  { useNewUrlParser: true, useUnifiedTopology: true },  )
.then(() => {
    console.log('db is connected')
})

mongoose.connection.on('error', err =>
console.log(`db connection error: ${err.message}`));



const port = process.env.PORT || 8080;
//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());
app.use(cors());


//const myOwnMidlleware = (req, res, next) => {
    //console.log('middleware is applied');
   // next();
//};
//app.use(myOwnMidlleware);



app.use("/", postRoutes); //can use
                                   //object destructuring to make const getPosts = require("./page/method")
app.use("/", authRoutes);  
app.use("/", userRoutes);   

app.get('/', (req, res) => {
    fs.readFile('./docs/apiDocs.json', (err, data) => {
        if(err) {
          return res.status(400).json({
            error: err
          })
        }
         const docs = JSON.parse(data);
         res.json(docs)

    })
})

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({error: "invalid token, means Unauthorized user!"});
    }
  });

app.listen(port, () => {
    console.log(`A node.js API is listening on port ${port}` )
});