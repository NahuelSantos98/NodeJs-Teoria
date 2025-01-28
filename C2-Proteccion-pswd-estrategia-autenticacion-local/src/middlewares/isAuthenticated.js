//Va a manejar el role del usuario, si está autorizado o no para ese endpoint.
export const isAuth = (req, res, next)=>{
    
    if(req.isAuthenticated()){//Passport define este metodo, devuelve Boolean
        return next()
    }

    return res.status(403).json({status: 'error', message: 'Unauthorized'})
}