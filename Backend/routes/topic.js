const middlewareControllers = require("../controllers/middlewareControllers");
const topicControllers = require("../controllers/topicControllers");

const router = require("express").Router();

//ADD TOPIC
router.post("/",middlewareControllers.vertifyTokenAdmin, topicControllers.addTopic);

//GET ALL TOPIC
router.get("/", topicControllers.getAllTopic);

//GET TOPIC BY ID
router.get("/:id", topicControllers.getTopic);

//UPDATE TOPIC
router.put("/update/:id",middlewareControllers.vertifyTokenAdmin, topicControllers.updateTopic);

//DELETE TOPIC
router.delete("/delete/:id",middlewareControllers.vertifyTokenAdmin, topicControllers.deleteTopic);

module.exports = router;