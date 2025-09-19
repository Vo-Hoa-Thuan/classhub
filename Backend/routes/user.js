const middlewareControllers = require("../controllers/middlewareControllers");
const userControllers = require("../controllers/userControllers");

const router = require("express").Router();

//GET USER
router.get("/:id",middlewareControllers.vertifyToken,userControllers.getUser)

//GET ALL USER
router.get("/",middlewareControllers.vertifyTokenAdmin,userControllers.getAllUser)

//DELETE USER
router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin ,userControllers.deleteUser)

//UPDATE USER
router.put("/update/:id",middlewareControllers.vertifyToken,userControllers.updateUser)


module.exports = router;