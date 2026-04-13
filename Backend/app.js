import express from "express";
import cookieParser from "cookie-parser";
import productRouters from "./src/routers/products.js";
import branchesRouters from "./src/routers/branches.js"
import registerEmployeeRouters from "./src/routers/registerEmployee.js"
import registerEmployeeRouters from "./src/routers/registerEmployee.js"
import registerCustomerRouters from "./src/routers/registerCustomer.js";  

//creo una constante que guarde mi libreria express
const app = express();
app.use(cookieParser());

//PARA QUE ACEPTE LOS JSON DESDE POSTMAN
app.use(express.json());

app.use("/api/products", productRouters)
app.use("/api/branches", branchesRouters)
app.use("/api/Employees", EmployeeRouter)
app.use("/api/customers", customerRouters)
app.use("/api/registerCustomer", registerCustomerRouters)
app.use("/api/registerEmployee", registerEmployeeRouters)


export default app;