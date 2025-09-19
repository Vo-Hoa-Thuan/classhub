const middlewareControllers = require("../controllers/middlewareControllers");
const orderAppControllers = require("../controllers/orderappControllers");
const router = require("express").Router();

//ADD ORDERAPP
router.post("/",middlewareControllers.vertifyToken, orderAppControllers.addOrderApp);

//GET ALL ORDERAPP
router.get("/",middlewareControllers.vertifyTokenAdmin, orderAppControllers.getAllOrderApp);

//GET ORDERAPP BY USER
router.get("/user/:id",middlewareControllers.vertifyToken, orderAppControllers.getOrderAppByUser);

//GET ORDERAPP BY ID
router.get("/:id",middlewareControllers.vertifyToken,orderAppControllers.getOrderApp);

//UPDATE ORDERAPP
router.put("/update/:id",middlewareControllers.vertifyToken, orderAppControllers.updateOrderApp);

//PAYMENT ORDER
router.post('/create_app_payment_url', middlewareControllers.vertifyToken, orderAppControllers.paymentVNPay);

//DELETE ORDERAPP
//router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin, orderAppControllers.deleteOrderApp);

module.exports = router;