const middlewareControllers = require("../controllers/middlewareControllers");
const orderTrackingControllers = require("../controllers/orderTrackingControllers");

const router = require("express").Router();

//ADD ORDER TRACKING
router.post("/",middlewareControllers.vertifyTokenAdmin, orderTrackingControllers.addOrderTracking);

//GET ALL ORDER TRACKING
router.get("/", middlewareControllers.vertifyToken, orderTrackingControllers.getAllOrderTracking);

//GET ORDER TRACKING BY ID
router.get("/:id", middlewareControllers.vertifyToken, orderTrackingControllers.getOrderTracking);

//UPDATE ORDER TRACKING
router.put("/update/:id",middlewareControllers.vertifyTokenAdmin, orderTrackingControllers.updateOrderTracking);

//DELETE ORDER TRACKING
router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin, orderTrackingControllers.deleteOrderTracking);

module.exports = router;