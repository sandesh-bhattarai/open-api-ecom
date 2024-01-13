const CheckLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware');
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request.middleware');
const userCtrl = require('./user.controller');
const userSvc = require('./user.service');
// const { UserValidatorSchema } = require('./user.validator');
const router = require('express').Router()
const {checkAccess} = require('../../middlewares/access-check.middleware')

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/user"
    next();
}

// router.get('/home', userCtrl.listForHome)

// TODO: UPDATE later
// router.get("/:slug/slug", userCtrl.getBySlug)
router.get("/by-status/:status", userCtrl.getUserByStatus)
router.get("/by-role/:role", userCtrl.getUserByRole)

router.route('/')
.get(
    CheckLogin,
    CheckPermission('admin'),
    userCtrl.listAllUsers
)

// router.route("/:id")
//     .get(
//         CheckLogin,
//         CheckPermission("admin"),
//         userCtrl.getById
//     )
//     .put(
//         CheckLogin,
//         CheckPermission('admin'),
//         checkAccess(userSvc),
//         dirSetup,
//         uploader.array('images'),
//         ValidateRequest(UserValidatorSchema),
//         userCtrl.updateById
//     )
//     .delete(
//         CheckLogin,
//         CheckPermission('admin'),
//         checkAccess(userSvc),
//         userCtrl.deleteById
//     )
module.exports = router;