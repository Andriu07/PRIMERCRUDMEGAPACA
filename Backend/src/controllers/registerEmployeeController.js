import nodemailer from "nodemailer"; //Enviar correo
import crypto from "crypto"; //Generar codigo aleatorio
import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; //Encriptar
import EmployeesModel from "../models/Employee.js";
import {config} from "../../config.js";
 
//array de funciones
const registerEmployeeController = {};
 
registerEmployeeController.register = async (req, res) => {
  //#1- Solicitar los datos
  const {
    name,
    lastName,
    salary,
    DUI,
    phone,
    email,
    Password,
    idBranches,
    isVerify
  } = req.body;
 
  try {
 
    //Validar que el correo no exista en la base de datos
    const existsEmployee = await EmployeesModel.findOne({email});
    if (existsEmployee){
      return res.status(400).json({message: "Employees already exist"})
    }
 
    //  Encriptar la contraseña
    const passwordHased = await bcryptjs.hash(Password, 10)
 
    //Generar un codigo aleatorio
    const randomNumber = crypto.randomBytes(3).toString("hex")
 
    //Guardamos en un token la informacion
    const token = jsonwebtoken.sign(
      //#1- ¿Que vamos a guardar?
      { randomNumber,
        name,
        lastName,
        salary,
        DUI,
        phone,
        email,
        Password: passwordHased,
        idBranches,
        isVerify,
    },
 
      //#2-Secret key
        config.JWT.secret,
      //#3-Cuando expira
      {expiresIn:"15m"}
    );
 
    res.cookie("RegistrarionCookie", token, {maxAge: 15 * 60 * 1000})
 
    //Enviamos el codigo aleatorio por correo electronico
    //1#- Creamso el transporter -> ¿Quien envia el correo?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth:{
        user: config.email.user_email,
        pass: config.email.user_password
      }
    })
 
    //#2- MailOption -> ¿?Quine lo recibe y como
      const mailOptions ={
        from: config.email.user_email,
        to: email,
        subject: "Verificacion de cuenta",
        text: "Para verificar tu cuenta, utiliza este codigo: " + randomNumber + " Expira en 15 minutos"
      }
 
    //#3- Enviar el correo
    transporter.sendMail(mailOptions, (error, info)=>{
      if(error){
        console.log("error"+error)
        return res.status(500).json({message:"Error sending email"})
      }
      return res.status(200).json({message:"Email sent"})
    })
  } catch (error) {
    console.log("error"+error)
    return res.status(500).json({message: "Internal server error"})
  }
 
};
 
//Verificar el codigo que acabamos de enviar
 
registerEmployeeController.verifyCode = async (req, res) => {
  try {
    //Solicitamos el codigo que escribieron en el frontend
    const {verificationCodeRequest} = req.body
 
    //Obtener el token de las cookies
    const token = req.cookies.RegistrarionCookie
   
    //Extrar toda la informacion del token
    const decoced = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomNumber: storedCode,
        name,
        lastName,
        salary,
        DUI,
        phone,
        email,
        Password,
        idBranches,
        isVerify,
    } = decoced;
 
    //Comparar lo que el usuario escribio con el codigo esta en el token
    if(verificationCodeRequest !== storedCode){
      return res.status(400).json({message: "Invalid code"})
    }
 
    //Si todo esta bien y el usuario escribe el codigolo registramos en la base de datos
    const NewEmployees = new EmployeesModel({
      name,
      lastName,
      salary,
      DUI,
      phone,
      email,  
      Password,
      idBranches,
      isVerify: true,
    });
 
    await NewEmployees.save();
 
    res.clearCookie("RegistrarionCookie")
 
    return res.status(200).json({message: "Employees register"})
 
  } catch (error) {
    console.log("error"+error)
    return res.status(500).json({message: "Internal server error"});
  }
};
 
export default registerEmployeeController;