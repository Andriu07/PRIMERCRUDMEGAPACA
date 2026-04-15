import customerModel from "../models/customers.js";
 
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
 
import { config } from "../../config.js";
import customerController from "./customersController.js";
 
//Array
const loginCustomer = {};
loginCustomer.login = async (req, res) => {
  //#1- solicita los datos
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }
 
  try {
    //#1-buscar correo en la base
    const customerFound = await customerModel.findOne({ email });
 
    //Si no existe el correo en la base de datos
    if(!customerFound){
        return res.status(400).json({message:"Customer not found"})
    }
 
    //verificar si el usuario esta bloqueado
    if(customerFound.timeOut && customerFound.timeOut > Date.now()){
        return res.status(403).json({message: "Cuenta bloqueada"})
    }
    //Validar la contraseña
    const isMatch = await bcrypt.compare(password, customerFound.password)
    if(!isMatch){
        customerFound.LoginAttempts = (customerFound.LoginAttempts || 0) + 1;
 
        //Si llega a 5 intentos fallidos se bloquea la cuenta
        if(customerFound.LoginAttempts >=5){
            customerFound.timeOut = Date.now() + 5 * 60 *1000;
            customerFound.LoginAttempts = 0;
 
            await customerFound.save();
            return res.status(403).json ({message:"Cuenta bloqueada por intetos fallidos"})  
        }

        await customerFound.save();
         return res.status(401).json ({message:"Contraseña incorrrecta"})  
    }
 
    //Resetear intentos si login correcto
    customerFound.LoginAttempts = 0;
    customerFound.timeOut = null;
 
    //Generar el token
    const token = jsonwebtoken.sign(
        //#1- Que datos vamos a guardar
        {id: customerFound._id, userType: "Customer"},
        //#2-secret key
        config.jwt.secret,
        //3- cuando expira
        {expiresIn: "30d"}
    );
 
    //el token lo guardamos en una cookie
    res.cookie("authCookie", token)
 
    return res.status(200).json({message: "Login exitoso"})
  } catch (error) {
    console.log("error" + error)
    return res.status(500).json({message: "Internal Server Error"})
  }
};
 
export default loginCustomer;