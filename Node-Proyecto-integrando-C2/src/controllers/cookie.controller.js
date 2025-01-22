
export const setCookieEndpoint = (req, res) => {
    res.cookie('idioma', 'bulgaro', {
        httpOnly: true,
        maxAge: 30000
    }).status(200).json({status: 'Ok', message: 'Cookie seteada'})
}

export const getCookieEndpoint = (req, res) => {
    res.send(req.cookies);
}

export const getCookieIdioma = (req, res) => {
    const {idioma} = req.cookies;

    if(idioma === 'español') res.send('El idioma es español')
    if(idioma === 'ingles') res.send('The language is english')

    res.send({status: 'Ok', message: `El idioma es ${idioma}`})
}

export const setSignedCookie = (req, res) => {
    res.cookie('nombre', 'nahuel', {
        httpOnly: true,
        maxAge: 30000,
        signed: true //Lo hace así s%3Anahuel.94IcV7IfpF7v%2BKe%2BPfxKX%2Ff11zD5Rz2L3YgEu8jF6gw
    }).status(200).json({status: 'Ok', message: 'Cookie seteada'})
}

export const getSignedCookie = (req, res) => {
    res.send(req.signedCookies); //Para obtener la cookie firmada
}

export const deleteCookie = (req, res) => {
    res.clearCookie('idioma').status(200).json({status: 'Ok', message: 'Cookie eliminada'})
}

export const loginWithCookie = (req, res) => {
    const { name, email } = req.body;
    
    // Sanitiza el nombre para asegurarse de que sea válido
    const sanitizedCookieName = name.replace(/[^a-zA-Z0-9_-]/g, '_'); // Reemplaza caracteres no válidos
    
    // Verifica si 'name' y 'email' están presentes
    if (!sanitizedCookieName || !email) {
        return res.status(400).json({ status: 'Error', message: 'Faltan parámetros' });
    }

    // Establece las cookies
    res.cookie('email', email, {
        httpOnly: true,
        maxAge: 15000, 
        signed: true
    });

    res.cookie('name', sanitizedCookieName, {
        httpOnly: true,
        maxAge: 15000, 
        signed: true
    });

    // Envía la respuesta después de establecer las cookies
    res.status(200).json({ 
        status: 'Ok', 
        message: 'Cookies seteadas', 
        cookies: req.signedCookies 
    });
}