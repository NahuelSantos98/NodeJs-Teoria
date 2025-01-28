export const registerEndpoint = async (req, res) => {
    res.send({ status: 'success', message: 'User registered' });
};

export const loginEndpoint = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', message: 'Invalid credentials' });
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
    };

    //console.log(req.session.passport.user); //Es donde está guardado el id de mongoDB del usuario
    //console.log(req.user._id); //Tambien se puede obtener desde acá.
    // console.log(req.session); //Devuleve todos los datos de la session:
//  Session {
//   cookie: {
//     path: '/',
//     _expires: 2025-01-28T04:18:11.824Z,
//     originalMaxAge: 60000,
//     httpOnly: true
//   },
//   passport: { user: new ObjectId('6797de55f1e65e09163b7d10') },
//   user: {
//     first_name: 'miguel',
//     last_name: 'roman',
//     age: 19,
//     email: 'miguel@gmail.com'
//   }
// }
    

    res.send({ status: 'success', payload: req.user });
};

export const privateEndpoint = (req, res)=>{
    res.send('Ruta privada')
}


export const logout = async (req, res) => {
    if(!req.session.user){
        return res.status(400).send({status: 'error', message: 'No user logged'})
    }
    req.session.destroy(err => {
        if (err) return res.status(500).json({status: 'error', message: 'Error while logging out'});
        // res.redirect('/views/login')
        res.send({status: 'success', message:'Logout from the session'});
    });
};

export const failRegisterEndpoint = async (req, res) => {
    console.log('Failed Strategy');
    res.send({ message: 'Failed' });
};

export const failLoginEndpoint = async (req, res) => {
    console.log('Login failed');
    res.send({ message: 'Login failed' });
};