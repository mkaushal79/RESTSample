var express = require('express');
var router = express.Router();

var userHandler = require("./userhandler");
var courseHandler = require("./coursehandler");
var securityHandler = require("./securityhandler");

router.get("/", function(req, res, next) {
   res.render("index",{title:'test'});
});


router.post("/login",securityHandler.generateToken);

/*
    USER MANAGEMENT
*/
router.get("/admin/users/", userHandler.getAll);
router.get("/admin/users/:uid", userHandler.getOne);
router.post("/admin/users", userHandler.create);
router.put("/admin/users", userHandler.update);
router.delete("/admin/users/:uid", userHandler.delete);

/*
    COURSES 
*/
router.get("/courses/", courseHandler.getAll);
router.get("/courses/:uid", courseHandler.getOne);
router.post("/admin/courses", courseHandler.create);
router.put("/admin/courses", courseHandler.update);
router.delete("/admin/courses/:uid", courseHandler.delete);


module.exports = router;
