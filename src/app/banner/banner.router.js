const router = require('express').Router()
const bannerCtrl = require('./banner.controller')
const checkLogin = require("../../middlewares/auth.middleware")
const checkPermission = require('../../middlewares/rbac.middleware')
const uploader = require("../../middlewares/uploader.middleware")
const validateRequest = require('../../middlewares/validate-request.middleware')
const { BannerRequestSchema } = require('./banner.validator')

// .../banner
const dirSet = (req, res, next) => {
    req.uploadDir = "./public/uploads/banner/"
    next()
}

router.get('/home', bannerCtrl.listHome);

router.route('/')
    .get(
        checkLogin, 
        checkPermission('admin'),
        bannerCtrl.listAllBanners
    )
    .post(
        checkLogin,
        checkPermission('admin'), 
        dirSet,
        uploader.single('image'),
        validateRequest(BannerRequestSchema),
        bannerCtrl.bannerCreate)

router.route('/:id')
    .get(
        checkLogin, 
        checkPermission('admin'),
        bannerCtrl.getDataById
    )
    .put(
        checkLogin,
        checkPermission('admin'), 
        dirSet,
        uploader.single('image'),
        validateRequest(BannerRequestSchema),
        bannerCtrl.updateById
    )
    .delete(
        checkLogin,
        checkPermission('admin'),
        bannerCtrl.deleteById
    )
module.exports = router