import passport from "passport";

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, (error, user, info) => {
            if (error) return next(error);
            if (!user) {
                return res.status(401).json({
                    error: info?.message || 'Authentication failed',
                });
            }
            req.logIn(user, (err) => {  //Este es para que al usar req.isAuth(), retorne true al passport verificar que está logueado
                if (err) {
                    return next(err);
                }
                next();
            });
        })(req, res, next);
    };
};
