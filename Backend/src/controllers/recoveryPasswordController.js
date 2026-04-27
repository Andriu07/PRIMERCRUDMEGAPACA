import jsonwebtoken from "jsonwebtoken";//guardar datos
import bcrypt from "bcryptjs";//encriptar
import crypto from "crypto";//generar codigo aleatorio
import nodemailer from "nodemailer";//

import {config}  from  "../../config.js"
import customerModel from "../models/customers.js"

import HTMLRecoveryEmail from "../Utils/senMailRecovery.js"

//array de funciones
const recoveryPasswordController = {}

recoveryPasswordController.requestCode = async (req, res) =>{
    try {
        //Solicitamos los datos
        const {email} = req.body;

        //validar el correo si existe en la base
        const userFound = await customerModel.findOne({email})
        if(!userFound){
            return res.status(404).json({message:"user not found"})
        }

        //generar codigo aleatorio
        const randomCode = crypto.randomBytes(3).toString("hex")

        //guardamos todo en un token
        const token = jsonwebtoken.sign(
            //que vamos a guardar (datos)
            {email, randomCode, userType:" customer", verified: false},
            //clave secreta
            config.JWT.secret,
            //cuando expira
            {expiresIn: "15m"}
        )
        //tiempo
        res.cookie("recoveryCookie", token ,{ maxAge: 15 * 60 * 1000})

        //enviar por correo electronico el codigp que generamos

        //quien  lo envia
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        //mailOptions -> quien lo envia y como
        const mailOptions ={
            from: config.email.user_email,
            to: email,
            subject: "Codigo de recuperacion",
            body: "El codigo expira en 15 min",
            html: HTMLRecoveryEmail(randomCode)
        }

        //enviar el correo
        transporter.sendMail(mailOptions), (error, info)=>{
            if(error){
                console.log("error"+error)
                 return res.status(500).json({message: "Error sending email"})
            }       
        }
             return res.status(200).json({message: "email sent"})
    } catch (error) {
        console.log("error" + error)
         return res.status(500).json({message: "internal server error"})
    }
};


//codigo de verificacion
recoveryPasswordController.verifyCode = async (req, res) => {
    try {
        //solicitamos los datos
        const {code} = req.body;
         
        //obtenemos la infromacion que esta dentro del token
        //accedemenos a la cookie
        const token = req.cookies.recoveryCookie;

        const decoded = jsonwebtoken.verify(token, config.JWT.secret)
        //ahora comparo el codigo que el usuario escribio con el que esta dentro del token
        console.log("Este es el codigo que el usuario esta poniendo" + code)
        console.log("Este es el codigo que el usuario esta poniendo" + decoded.randomCode)
        if(code !== decoded.randomCode){
             return res.status(400).json({message: "Invalid code"})
        }

        //si escribe bien el codigo
        //vamos acolocar en el token que ya esta verificado
        const newToken  = jsonwebtoken.sign(
            //que vamos a guardar
            {email: decoded.email, userType:"customer", verified:true},
            //clave secreta
            config.JWT.secret,
            //cuando expira
            {expireIn:"15m"},
        );
        res.cookie("recoveryCookie", newToken, {maxAge: 15 * 60 * 1000});
         return res.status(200).json({message: "Code verified successfuly"});
    } catch (error) {
        console.log("error" + error)
           return res.status(500).json({message: "Internal server error"});
    }
};

//nueva contraseña
recoveryPasswordController.newPassword = async (req , res ) => {
    try {
        //solicitamos los datos
        const {newPassword, confirmnewPassword} = req.body;

        //comparo las dos contraseñas
        if(newPassword !== confirmnewPassword){
              return res.status(400).json({message: "Password doesnt match"});
        }
        //vamos a comprobar que la constante verified que esta en el token
        //ya este en true(o sea que ya haya pasado por el paso 2)
        const token = req.cookies.recoveryCookie;
        const decoded =jsonwebtoken.verify (token, config.JWT.secret);

        if(!decoded.verified){
              return res.status(400).json({message: "Code not verified"});
        }

        //////////////////////////////////////
        //Encriptar
        const passwordHash = await bcrypt.hash(newPassword, 10)
        //actualizamos la contraseña en nuestra base de datos
        await customerModel.findOneAndUpdate(
            {email: decoded.email},
            {password: passwordHash},
            {new:true},
        );

        //limpiar la cookie
        res.clearCookie("recoveryCookie")
          return res.status(200).json({message: "Password Updated"});
    } catch (error) {
       console.log("error" + error)
         return res.status(500).json({message: "Internal server error"});
    }
    
};

export default  recoveryPasswordController;