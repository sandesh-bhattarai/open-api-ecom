const CheckLogin = require('../../middlewares/auth.middleware');
const CheckPermission = require('../../middlewares/rbac.middleware');
const uploader = require('../../middlewares/uploader.middleware');
const ValidateRequest = require('../../middlewares/validate-request.middleware');
const productCtrl = require('./product.controller');
const productSvc = require('./product.service');
const { ProductValidatorSchema } = require('./product.validator');
const router = require('express').Router()
const {checkAccess} = require('../../middlewares/access-check.middleware')

const dirSetup = (req, res, next) => {
    req.uploadDir = "./public/uploads/product"
    next();
}

router.get('/home', productCtrl.listForHome)

// TODO: UPDATE later
router.get("/:slug/slug", productCtrl.getBySlug)

router.route('/')
.get(
    CheckLogin,
    CheckPermission('admin'),
    productCtrl.listAllProducts
)
.post(
    CheckLogin,
    CheckPermission('admin'),
    dirSetup,
    uploader.array('images'),
    ValidateRequest(ProductValidatorSchema),
    productCtrl.createProduct)



router.route("/:id")
    .get(
        CheckLogin,
        CheckPermission("admin"),
        productCtrl.getById
    )
    .put(
        CheckLogin,
        CheckPermission('admin'),
        checkAccess(productSvc),
        dirSetup,
        uploader.array('images'),
        ValidateRequest(ProductValidatorSchema),
        productCtrl.updateById
    )
    .delete(
        CheckLogin,
        CheckPermission('admin'),
        checkAccess(productSvc),
        productCtrl.deleteById
    )
module.exports = router;