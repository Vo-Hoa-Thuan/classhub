const middlewareControllers = require("../controllers/middlewareControllers");
const shippingCompanyControllers = require("../controllers/shippingcompanyControllers");


const router = require("express").Router();

//ADD SHIPPING COMPANY
router.post("/",middlewareControllers.vertifyTokenAdmin, shippingCompanyControllers.addShippingCompany);

//GET ALL SHIPPING COMPANY
router.get("/", shippingCompanyControllers.getAllShippingCompany);

//GET SHIPPING COMPANY BY ID
router.get("/:id", shippingCompanyControllers.getShippingCompany);

//UPDATE SHIPPING COMPANY
router.put("/update/:id",middlewareControllers.vertifyTokenAdmin, shippingCompanyControllers.updateShippingCompany);

//DELETE SHIPPING COMPANY
router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin, shippingCompanyControllers.deleteShippingCompany);

module.exports = router;