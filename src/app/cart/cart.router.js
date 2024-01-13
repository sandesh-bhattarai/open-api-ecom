const CheckLogin = require("../../middlewares/auth.middleware");
const CheckPermission = require("../../middlewares/rbac.middleware");
const ValidateRequest = require("../../middlewares/validate-request.middleware");
const cartCtrl = require("./cart.controller");
const { addToCartSchema } = require("./cart.validator");

const router= require("express").Router();

router.post('/add', 
    CheckLogin, 
    CheckPermission(['customer','admin']),
    ValidateRequest(addToCartSchema),
    cartCtrl.addToCart
)

router.get('/list', 
    CheckLogin, 
    CheckPermission(['customer','admin']),
    cartCtrl.listCart
    )
router.get('/order/list', 
    CheckLogin, 
    CheckPermission(['customer','admin']),
    cartCtrl.listOrder
    )
router.delete(
    '/:id/delete', 
    CheckLogin, 
    CheckPermission(['customer', 'admin']),
    cartCtrl.deleteItemFromCart
)

router.post("/order", 
    CheckLogin, 
    CheckPermission(['customer', 'admin']),
    cartCtrl.createOrder
)
module.exports = router;