const users = [
    {id: 1, username: 'nahuel', password: 'nahuel123', admin: true},
    {id: 2, username:'morena', password: 'morena123', admin: true},
    {id: 3,username: 'lucas', password: 'lucas123', admin: false},
    {id: 4,username: 'julian', password: 'julian123', admin: false},
    {id: 5,username: 'lautaro',password: 'lautaro123', admin: false}
]


export const login = (req, res) => {
    const {user, password} = req.body;

    const userIndex = users.findIndex(u => u.username === user && u.password === password);

    if(userIndex < 0) return res.status(404).json({message: 'User o password incorrect'});

    const userExists = users[userIndex];
    
    req.session.info = {
        loggedIn: true,
        count: 1,
        admin: userExists.admin,
    };
    res.status(200).json({message: 'Logueado correctamente'});
}

export const authEndpoint = (req, res) => {
    req.session.info.count++;
    res.status(200).json({
        count: req.session.info.count,
        message: 'Authorized for endpoint',
        session: req.session
    });
}

export const authAdminEndpoint = (req, res)=>{
    req.session.info.count++;
    res.status(200).json({
        count: req.session.info.count,
        message: 'Admin endpooint',
        session: req.session
    });
}