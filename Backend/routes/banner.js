const bannerControllers = require("../controllers/bannerControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

const router = require("express").Router();

//ADD BANNER
router.post("/",middlewareControllers.vertifyTokenAdmin, bannerControllers.addBanner);

//GET ALL BANNER
router.get("/", bannerControllers.getAllBanner);

//GET BANNER
router.get("/:id", bannerControllers.getBanner);

//UPDATE BANNER
router.put("/update/:id",middlewareControllers.vertifyTokenAdmin, bannerControllers.updateBanner);

//DELETE BANNER
router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin, bannerControllers.deleteBanner);

module.exports = router;