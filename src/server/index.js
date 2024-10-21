const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require('cors')

require('dotenv').config()

const saveForm = require('./saveForm.js');
const getForm = require('./getForm.js');
const apiRoutes = require('./routes/index.js');


const app = express()
const port = 8000

const corsOption = {
  origin: ['http://localhost:5174'],
};

app.use(cors(corsOption))

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use('/api', apiRoutes)

// app.get('/api', (req, res) => {
//   res.sendFile(path.join(__dirname, '/auth.html'));
// })

app.get('/getForm', getForm);

app.post('/formSubmit', saveForm)

app.listen(port, () => {

  mongoose
  .connect(
    process.env.MONGO_URI,
  )
  .then(() => console.log("mongodb connected"))
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });

  console.log(`Example app listening on port ${port}`)
})