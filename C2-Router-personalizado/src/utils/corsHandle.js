const corsHandle = (origin, callback) => {
    const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:5173'
    ];

    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
    }

    console.error(`CORS error: Origin ${origin} is not allowed`);
    return callback(new Error('Not allowed by CORS'));
}

export default corsHandle