const express = require("express");
const router = express.Router();
const { userController } = require("../controllers/UserController");

router.get("/", userController.getAll);
router.get("/:id", userController.getById);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);
router.post("/follow", userController.followUser);
router.post("/unfollow", userController.unfollowUser);

module.exports = router;
