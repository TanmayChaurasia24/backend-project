const asynchandler = (requesthandler) => {
    return (req, res, next) => {
        Promise.resolve(requesthandler(req, res, next)).catch((err) => next(err)); // Added a semicolon here
    };
};

export { asynchandler };
