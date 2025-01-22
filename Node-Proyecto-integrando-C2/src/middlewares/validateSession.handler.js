export const validateSession = (req, res, next) => {
    if(req.session.info && req.session.info.loggedIn) next(); //Si la sesión existe y está logueado, se pasa al siguiente middleware
    else res.status(401).json({message: 'Unauthorized'}); //Si no, se envía un mensaje de error
}
