const authControllers = require("../controllers/authControllers");
const middlewareControllers = require("../controllers/middlewareControllers");
const { validateRegister, validateLogin, validateRefreshToken } = require("../middleware/validation");

const router = require("express").Router();

//Register
router.post("/register", validateRegister, authControllers.registerUser);

//Login
router.post("/login", validateLogin, authControllers.loginUser);

//Check Password
router.post("/check-password",authControllers.checkPassword);

//Check Token
router.post("/check-token",middlewareControllers.checkToken);

//Check Admin Token
router.post("/check-admin",middlewareControllers.checkTokenAdmin);

//Refresh Token
router.post('/refresh', validateRefreshToken, authControllers.refreshToken);

//Logout
router.post('/logout', authControllers.logoutUser);

//Logout All Sessions
router.post('/logout-all', middlewareControllers.vertifyToken, authControllers.logoutAllSessions);

//Get User Sessions
router.get('/sessions', middlewareControllers.vertifyToken, authControllers.getUserSessions);

//Get Current User
router.get('/me', middlewareControllers.vertifyToken, authControllers.getCurrentUser);

module.exports = router;