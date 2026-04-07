import express from "express";
import customerController from "../controllers/customersController.js";

//usamos Router() de la libreria express para definir los metodos HTTP a utilizar
const router = express.Router();

router.route("/")
.get(customerController.getCustomer);

router.route("/id:")
.put(customerController.putCustomer)
.delete(customerController.deleteCustomer);

export default router;