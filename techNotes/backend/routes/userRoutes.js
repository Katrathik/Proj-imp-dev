const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT) 


// router.route('/) for users means we are aldready at /users and this is just the root of it
// then to this, we can use .get(), .post(), .patch(), and .delete() via chaining
router.route("/")
    .get(usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = router