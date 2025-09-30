const middlewareControllers = require("../controllers/middlewareControllers");
const userControllers = require("../controllers/userControllers");
const { validateUpdateUser } = require("../middleware/validation");

const router = require("express").Router();

//GET USERS WITH ORDERS
router.get("/with-orders",middlewareControllers.vertifyTokenProductManager,userControllers.getUsersWithOrders)

//GET ALL USER
router.get("/",middlewareControllers.vertifyTokenProductManager,userControllers.getAllUser)

//GET USER
router.get("/:id",middlewareControllers.vertifyToken,userControllers.getUser)

//GET USER ORDER DETAILS FOR DELETION CONFIRMATION
router.get("/order-details/:id",middlewareControllers.vertifyTokenAdmin,userControllers.getUserOrderDetails)

//DELETE USER
router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin ,userControllers.deleteUser)

//UPDATE USER
router.put("/update/:id",middlewareControllers.vertifyToken,validateUpdateUser,userControllers.updateUser)


module.exports = router;