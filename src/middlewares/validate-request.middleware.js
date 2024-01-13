const ValidateRequest = (schmea) => {
    return (req, res, next) => {
        try {
            let payload = req.body;
            schmea.parse(payload)
            next();
        } catch(except) {
            next(except);
        }
    }
}


module.exports = ValidateRequest