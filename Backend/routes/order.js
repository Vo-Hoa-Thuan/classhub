const orderControllers = require("../controllers/orderControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

const router = require("express").Router();

//ADD ORDER
router.post("/",middlewareControllers.vertifyToken, orderControllers.addOrder);

//GET ALL ORDER
router.get("/",middlewareControllers.vertifyTokenAdmin, orderControllers.getAllOrder);

//GET ORDER BY USER
router.get("/user/:id",middlewareControllers.vertifyToken, orderControllers.getOrderByUser);

 //GET PAYMENT BY ID
 router.get("/:id", middlewareControllers.vertifyToken, orderControllers.getOrder);

//UPDATE ORDER
router.put("/update/:id",middlewareControllers.vertifyToken, orderControllers.updateOrder);

//DELETE PAYMENT
// router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin, orderControllers.deleteOrder);

//PAYMENT ORDER
router.post('/create_payment_url', middlewareControllers.vertifyToken, orderControllers.paymentVNPay);

module.exports = router;