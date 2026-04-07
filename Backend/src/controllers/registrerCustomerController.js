import nodemailer from "nodemailer";
import crypto  from "crypto";
import  jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import customerModel from "../models/customers.js"

//array de funciones
const registerCustomerController = {};

registerCustomerController.register = async (req, res) =>{
 //solicitar lso datos
 const{
    name,
    lastName,
    birthdate,
    email,
    password,
    isVerfied
 } = req.body;

 try{
   
 }catch(error){

 }
};