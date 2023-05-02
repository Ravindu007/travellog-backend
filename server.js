require("dotenv").config()
const mongoose = require("mongoose")
const express = require("express")
const cors = require("cors")

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAaccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

module.exports = {admin:admin}

const App = express()

//midlleware
App.use(cors());


App.use(express.json())

App.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept"
  )
  next()
})


//establishing router
const travelLogRoutes = require("./routes/travelLogRoutes")
const userRoutes = require("./routes/userRoutes")



//establish routes
App.use("/api/travelLogs",travelLogRoutes)
App.use("/api/user", userRoutes)


mongoose.set('strictQuery', false)

//establish connection to the database
mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    App.listen(process.env.PORT, ()=>{
      console.log("Listening to port:", process.env.PORT," and connected to DB");
    })
  })
  .catch((error)=>{
    console.log(error);
  })