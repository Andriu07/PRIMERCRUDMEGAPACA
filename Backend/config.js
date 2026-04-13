import dotenv  from "dotenv";

//ejecutamos las librerias
dotenv.config()
export const config = {
    db:{
       URI: process.env.DB_URI,
    },
    JWT: {
     secret: process.env.JWT_Secret_Key,
    },
    email:{
        user_email: process.env.USER_EMAIL,
        user_password: process.env.USER_PASSWORD
    }
};