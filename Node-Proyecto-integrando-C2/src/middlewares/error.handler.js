export const errorHandler = (error, req, res, next) => {
    console.error('An error occurred:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error. Please try again later.', });
};