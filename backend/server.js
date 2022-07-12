/*set up server and set initial route*/ 


import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()

app.use(cors()) //cross origin request
app.use(express.json()) // middleware
app.use(function(req,res,next){console.log(req.body); 

next()})// middleware2

app.use("/api/v1/restaurants", restaurants)
app.use("*", (req,res) => res.status(404).json({error : "not found"}))

export default app