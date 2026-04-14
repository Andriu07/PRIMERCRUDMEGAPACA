import customerModel from "../models/customers.js"
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import {config} from "../../config.js";
import customerController from "./src/customersController.js"

//array
const loginCustomerController = {};

loginCustomerController.login = async (req, res) =>{
    //solicito los datos 
    const{email, password} = req.body;
     
       //REGEX
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }
    try {
       //1 buscar el correo electronico en la base de datos
        const customerFound = await customerModel.findOne({email});
        if(!customerFound){
            return res.status(400).json({message:"Customer not found"})
        }

        //verificar si el usuario este bloquedo 
        if(customerFound.timeOut && customerFound.timeOut > Date.now()){
            return res.status(403).json({message:"Cuenta bloqueada"})
        }
    
        //validar la contraseña
        const isMatch = await bcrypt.compare(password, customerFound.password)
         if(!isMatch){
            customerFound.loginAttemps = (customerFound.loginAttemps || 0) + 1; 

            //si llega a 5 intentos fallidos se bloque la cuenta
            if(!customerFound.loginAttemps >= 5){
                customerFound.timeOut = Date.now() + 5 * 60 * 100;
                customerFound.loginAttemps = 0;

                await customerFound.save();

                return res.status(403).json({message:"Cuenta bloqueada por multiples intentos"})
            }
         }

         //resetear intentos si login es correcto
         customerFound.loginAttemps = 0
         customerFound.timeOut = null;

         //Generar el token
         const token = jsonwebtoken.sign(
            //Que datos vamos a guardar
            {id: customerFound._id, userType: "Customer"},
            //secret key
            config.JWT.secret,
            //cuando expira
            {expiresIn:"30d"}
         );

         //el token lo guardamos en una cookie
         res.cookie("auth Cookie", token)
         return re.status(200).json({message:"login exitoso"})
    } catch (error) {
        console.log("error" + error)
        return res.status(500).json({message:"Internal Server Error"})
    }
};

export default loginCustomerController;