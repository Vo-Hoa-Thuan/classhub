const authControllers = require("../controllers/authControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

const router = require("express").Router();

//Register
router.post("/register",authControllers.registerUser);

//Login
router.post("/login",authControllers.loginUser);

//Check Password
router.post("/check-password",authControllers.checkPassword);

//Check Token
router.post("/check-token",middlewareControllers.checkToken);

//Check Admin Token
router.post("/check-admin",middlewareControllers.checkTokenAdmin);

//Logout
router.post('/logout',authControllers.logoutUser)

module.exports = router;