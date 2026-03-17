import mongoose, { connect } from "mongoose";

mongoose,connect("mongodb://localhost:27017/megapacaDB")

//comprobar que funcione
const connection =mongoose.connection;

connection.once("opne", ()=>{
    console.log("DB is connected")
})

connection.on("disconnected", (error)=>{
    console.log("DB is desconnected" + error)
})

connection.on("error", (error)=>{
    console.log("error found" + error)
})