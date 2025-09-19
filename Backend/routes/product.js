const productControllers = require("../controllers/productControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

const router = require("express").Router();

//ADD PRODUCT
router.post("/",middlewareControllers.vertifyTokenAdmin, productControllers.addProduct);

//GET ALL PRODUCT
router.get("/", productControllers.getAllProduct);

//GET PRODUCT
router.get("/:id", productControllers.getProduct);

//GET PRODUCT BY ADMIN
router.get("/admin/:id", middlewareControllers.vertifyTokenAdmin, productControllers.getProductByAdmin);

//SEARCH PRODUCT
router.post("/search", productControllers.searchProduct);

//SEARCH PRODUCT
router.post("/getlink_download",middlewareControllers.vertifyToken, productControllers.getLinkDownload);

//CHECK DOWNLOADED
router.post("/check_downloaded",middlewareControllers.vertifyToken, productControllers.checkDownloaded);

//UPDATE PRODUCT
router.put("/update/:id",middlewareControllers.vertifyTokenAdmin, productControllers.updateProduct);

//UPDATE PURCHASED PRODUCT
router.put("/update-count-purchased/:id",middlewareControllers.vertifyToken, productControllers.updatePurchasedProduct);

//UPDATE PURCHASED AND QUANTITY PRODUCT
router.put("/update_qty_purchased/:id",middlewareControllers.vertifyToken, productControllers.updateQtyPurchased);

//DELETE PRODUCT
router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin, productControllers.deleteProduct);



module.exports = router;