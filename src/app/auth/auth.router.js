const router = require("express").Router()
const authCtrl = require("./auth.controller")
const uploader = require("../../middlewares/uploader.middleware");
const ValidateRequest = require("../../middlewares/validate-request.middleware");
const { registerSchema, passwordSchema, loginSchema, emailValidatonSchema } = require("./auth.validator");
const CheckLogin = require("../../middlewares/auth.middleware");
const CheckPermission = require("../../middlewares/rbac.middleware");
const { z } = require("zod");

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/users";
    next()
}

// Auth and Authorization routes start 
router.post('/register',dirSetup, uploader.single('image'),ValidateRequest(registerSchema), authCtrl.register)

router.get('/verify-token/:token', authCtrl.verifyToken)
router.post("/set-password/:token", ValidateRequest(passwordSchema), authCtrl.setpassWord)

router.post("/login",ValidateRequest(loginSchema), authCtrl.login)

// loggedin All user roles
router.get('/me', CheckLogin, authCtrl.getLoggedInUser)

// TODO: Refresh, token, refresh token 
// refersh token => userId
// new token access jwt token 
router.get("/refresh-token", CheckLogin,  (req, res, next) => {})

// email address receive as body, validate email 
// attach resetToken and resetExpiry update user  => 3h
// email send => with resetToken => 
    //  http://localhost:5173/set-password/resetToken
router.post('/forget-password', ValidateRequest(emailValidatonSchema), authCtrl.forgetPassword)

// route

// {password: "", confirmPassword: ""}, token => resetToken
router.post('/reset-password/:resetToken', ValidateRequest(passwordSchema), authCtrl.resetPassword)
// {password: encPass, resetToken: null, resetExpiry: null} update 

router.post('/logout', CheckLogin,  authCtrl.logoutUser)

module.exports = router;


// domain link 
// facebook.com
// subdomain ===> api.facebook.com
// /var/www/html/

// api/

// git pull origin <branch>
// npm i 
// .env 
// touch .env 
// nano .env 
// pm2 