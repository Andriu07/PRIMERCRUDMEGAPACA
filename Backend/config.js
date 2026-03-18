import dotenv  from "dotenv";

//ejecutamos las librerias
dotenv.config()
export const config = {
    db:{
       URI: process.env.DB_URI
    }
}