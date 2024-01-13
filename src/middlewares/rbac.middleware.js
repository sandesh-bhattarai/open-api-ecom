const CheckPermission = (role) => {
    return (req, res, next) => {
        let loggedInUser = req.authUser;
        if(!loggedInUser) {
            next({code: 401, message: "Unauthenticated"})
        }

        // Array.isArray(var)
        if(
            (typeof role === 'string' && loggedInUser.role === role) || 
            (typeof role !== 'string' && role.includes(loggedInUser.role)) 
        ) {
            next();
        } else {
            next({code: 403, message: "You do not have permissoin"})
        }

    }
}

module.exports = CheckPermission;