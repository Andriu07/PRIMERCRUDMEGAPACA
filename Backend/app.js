import express from "express";
import productRouter from "./src/routers/products.js";

//creo una constante que guarde mi libreria express
const app = express();

//PARA QUE ACEPTE LOS JSON DESDE POSTMAN
app.use(express.json)

app.use("/api/products", productRouter)

export default app;