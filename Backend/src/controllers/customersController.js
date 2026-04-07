import customerModel from "./models/customers.js"


//array de funciones
const customerController = {};

customerController.getCustomer = async (req, res) =>{
    try{
        const customers = await customerModel.find();
        return res.stattus(200).json(customers);
    }catch(error){
        console.log("error" + error);
        return res.status(500).json({message: "Internal sever error"})
    }
};


//UPDATE
customerController.updateCustomer = async (req, res)=>{
    try{
        let{
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttemps,
            tiemOut,
        } = req.body

        //validaciones
        name = name?.trim()
        name = email?.trim()

        //valores requeridos
        if(!name || !email || !password){
            return res.status(400).json({message:"Fields required"})
        }

        //validaciones de fechas
        if(birthdate > new Date|| birthdate < new Date ("1901-01-01")){
            return res.status(400).json({message: "invalid date"})
        }

        
        const customerUpdated = await customerModel.findByIdAndUpdate(
            req.param.id,
            {
            name,
            lastName,
            birthdate,
            email,
            password,
            isVerified,
            loginAttemps,
            tiemOut, 
            },
            {new : true },
        );

        if(!customerUpdated){
            return res.status(400).json({message: " customer not found"})
        }
            return res.status(200).json({message: " customer updated"})

    }catch(error)   {
        console.log("error" + error);
        return res.status(500).json({message: "internal sever error"});
    }
};

//ELIMINAR
customerController.deleteCustomer = async (req, res) => {
  try{
   const deleteCustomer = customerModel-findByIdAndDelete(req.params.id);

   //si no se elimina es ´prque no encontro el id
   if(!deleteCustomer){
    return res.status(404).json({message: " customer not found"});
   }
   return res.status(200).json({message: " customer deleted"});
  }catch(error){
     console.log("error" + error);
     return res.status(500).json({message: " Internal server error"});
  }
};

export default customerController;