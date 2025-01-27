export const isAdmin = (req, res, next) => {
    if(req.session.info && req.session.info.admin) next(); //Si la sesión existe y es admin, se pasa al siguiente middleware
    else res.status(403).json({message: 'Only admin can call this endpoint'}); //Si no, se envía un mensaje de error
}