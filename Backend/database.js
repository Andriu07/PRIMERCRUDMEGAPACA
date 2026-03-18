import mongoose, { connect } from "mongoose";
import {config} from "./config.js"

mongoose.connect(config.db.URI)

//comprobar que funcione
const connection =mongoose.connection;

connection.once("open", ()=>{
    console.log("DB is connected")
})

connection.on("disconnected", (error)=>{
    console.log("DB is desconnected" + error)
})

connection.on("error", (error)=>{
    console.log("error found" + error)
})