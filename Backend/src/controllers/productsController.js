/**creo un array de metodos */

const productsController ={};

//importar el schema de la coleccion que vamos a utilizar
import productsModel from "../models/products.js";
 
//GET
//select
productsController.getProducts = async(req, res) =>{
    const products = await productsModel.find()
    res.json(products)
    
}
     //POST
    //insert
    productsController.insertProducts = async (req, res)=>{
        //solicito los datos a guardar
        const{name, description, price, stock} = req.body;
        //lleno una instancia de mi squema
        const newProduct = new productsModel({name, description , price , stock})
         //guardo en la base de datos
         await newProduct.save()

         res.json({message: "product saved"})
     };

     //DELETE
     //ELIMINAR
    productsController.deleteProducts = async( req, res)=>{
        await productsModel.findByIdAndDelete(req.paramas.id);
        res.json({message: "product deleted"});
    };
     
    //PUT
    //ACTUALIZAR
    productsController.updateProducts = async(req, res)=>{
        //pido los nuevos datos
        const{name, description,price,stock} = req.body;
        //actualizo los datos
        await productsModel.findByIdAndUpdate(req.params.id,{
            name,
            description,
            price,
            stock,
        },{new:true} );

      res.json({message: "product updated"})
    }
    
    export default productsController;