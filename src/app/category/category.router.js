const CheckLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware');
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request.middleware');
const categoryCtrl = require('./category.controller');
const categorySvc = require('./category.service');
const { CategoryValidatorSchema } = require('./category.validator');
const router = require('express').Router()
const {checkAccess} = require('../../middlewares/access-check.middleware')

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/category"
    next();
}

router.get('/home', categoryCtrl.listForHome)

// TODO: UPDATE later
router.get("/:slug/slug", categoryCtrl.getBySlug)

router.route('/')
.get(
    CheckLogin,
    CheckPermission('admin'),
    categoryCtrl.listAllCategories
)
.post(
    CheckLogin,
    CheckPermission('admin'),
    dirSetup,
    uploader.single('image'),
    ValidateRequest(CategoryValidatorSchema),
    categoryCtrl.createCategory)



router.route("/:id")
    .get(
        CheckLogin,
        CheckPermission("admin"),
        categoryCtrl.getById
    )
    .put(
        CheckLogin,
        CheckPermission('admin'),
        checkAccess(categorySvc),
        dirSetup,
        uploader.single('image'),
        ValidateRequest(CategoryValidatorSchema),
        
        categoryCtrl.updateById
    )
    .delete(
        CheckLogin,
        CheckPermission('admin'),
        checkAccess(categorySvc),
        categoryCtrl.deleteById
    )
module.exports = router;