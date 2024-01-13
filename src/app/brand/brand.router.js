const router = require('express').Router()
const brandCtrl = require('./brand.controller')
const checkLogin = require("../../middlewares/auth.middleware")
const checkPermission = require('../../middlewares/rbac.middleware')
const uploader = require("../../middlewares/uploader.middleware")
const validateRequest = require('../../middlewares/validate-request.middleware')
const { BrandRequestSchema } = require('./brand.validator')

// .../brand
const dirSet = (req, res, next) => {
    req.uploadDir = "./public/uploads/brand/"
    next()
}


router.get("/:slug/slug", brandCtrl.getDetailBySlug)
router.get('/home', brandCtrl.listHome);

router.route('/')
    .get(
        checkLogin, 
        checkPermission('admin'),
        brandCtrl.listAllBrands
    )
    .post(
        checkLogin,
        checkPermission('admin'), 
        dirSet,
        uploader.single('image'),
        validateRequest(BrandRequestSchema),
        brandCtrl.brandCreate)

router.route('/:id')
    .get(
        checkLogin, 
        checkPermission('admin'),
        brandCtrl.getDataById
    )
    .put(
        checkLogin,
        checkPermission('admin'), 
        dirSet,
        uploader.single('image'),
        validateRequest(BrandRequestSchema),
        brandCtrl.updateById
    )
    .delete(
        checkLogin,
        checkPermission('admin'),
        brandCtrl.deleteById
    )
module.exports = router