const logoutContrroller ={}

logoutContrroller.logout = async (req, res) =>{
    //Limpiar la cokkie que tiene la informacion de quien incio sesion
    res.clearCookie("authCookie");

    return res.status(200).json({message:"Sesion cerrada"});
};

export default logoutContrroller;