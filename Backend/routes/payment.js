const middlewareControllers = require("../controllers/middlewareControllers");
const paymentControllers = require("../controllers/paymentControllers");

const router = require("express").Router();

//ADD PAYMENT
router.post("/",middlewareControllers.vertifyTokenAdmin, paymentControllers.addPayment);

//GET ALL PAYMENT
router.get("/",middlewareControllers.vertifyTokenAdmin, paymentControllers.getAllPayment);

//GET ALL PAYMENT BY CLIENT
router.get("/client", paymentControllers.getAllPaymentClient);

//GET PAYMENT
router.get("/:id", paymentControllers.getPayment);

//UPDATE PAYMENT
router.put("/update/:id",middlewareControllers.vertifyTokenAdmin, paymentControllers.updatePayment);

//DELETE PAYMENT
router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin, paymentControllers.deletePayment);

module.exports = router;