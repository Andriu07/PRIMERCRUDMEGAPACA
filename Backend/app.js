import express from "express";
import cookieParser from "cookie-parser";
import productRouters from "./src/routers/products.js";
import branchesRouters from "./src/routers/branches.js"
import registerEmployeeRouters from "./src/routers/registerEmployee.js"
import registerCustomerRouters from "./src/routers/registerCustomer.js";
import customerRouters from "./src/routers/customer.js"  
import loginCustomerRouters from "./src/routers/loginRouter.js"
import EmployeeRouters from "./src/routers/Employee.js"
import logoutRouters from "./src/routers/logout.js"
import cors from "cors";

//creo una constante que guarde mi libreria express
const app = express();

app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    //perimitir el envio de cookies y credenciales
    credentials: true,
}))


app.use(cookieParser());

//PARA QUE ACEPTE LOS JSON DESDE POSTMAN
app.use(express.json());

app.use("/api/products", productRouters)
app.use("/api/branches", branchesRouters)
app.use("/api/Employees", EmployeeRouters)
app.use("/api/customers", customerRouters)
app.use("/api/registerCustomer", registerCustomerRouters)
app.use("/api/registerEmployee", registerEmployeeRouters)
app.use("/api/login", loginCustomerRouters)
app.use("/api/logout", logoutRouters )


export default app;