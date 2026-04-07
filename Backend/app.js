import express from "express";

import productRouter from "./src/routers/products.js";
import customerRouters from  "./src/routers/customer.js";

//creo una constante que guarde mi libreria express
const app = express();

//PARA QUE ACEPTE LOS JSON DESDE POSTMAN
app.use(express.json())

app.use("/api/products", productRouter)

app.use("./api/customers", customerRouters)
app.use("./api/registerCustomer")


export default app;