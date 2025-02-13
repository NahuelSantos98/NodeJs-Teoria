export const roleAuth = (role) => { //Recibe el rol
    return async(req, res, next)=>{
        if(!req.user) return res.status(401).json({ error: 'Unauthorized' }); //Si el user no está autenticado
        if(req.user.role !== role) return res.status(403).json({ error: 'Forbidden' }) 
            //Si el rol del usuario autenticado es diferente al rol que se pasa por parametro = no auth
            next() //Si es =
    }
}