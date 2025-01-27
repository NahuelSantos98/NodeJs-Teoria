export const registerEndpoint = async (req, res) => {
    res.send({ status: 'success', message: 'User registered' });
};

export const loginEndpoint = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
    };

    res.send({ status: 'success', payload: req.user });
};

export const logout = async (req, res) => {
    console.log(req.session.user);
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error while logging out');
        
        res.redirect('/views/login');
    });
};

export const failRegisterEndpoint = async (req, res) => {
    console.log('Failed Strategy');
    res.send({ error: 'Failed' });
};

export const failLoginEndpoint = async (req, res) => {
    console.log('Login failed');
    res.send({ error: 'Login failed' });
};