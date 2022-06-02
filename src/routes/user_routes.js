const router = require('express').Router();
const UserModel = require('./../models/user_model');

router.get("/:userid", async function(req, res) {
    const foundUser = await UserModel.findOne({ userid: req.params.userid });
    res.json(foundUser);
});

router.post("/login", async function(req, res) {
    const requestData = req.body;
    const foundUser = await UserModel.findOne({ email: requestData.email });

    if(foundUser) {
        if(requestData.password == foundUser.password) {
            res.json({ success: true, data: foundUser });
        }
        else {
            res.json({ success: false, message: "Incorrect Password!" });
        }
    }
    else {
        res.json({ success: false, message: "No such user found!" });
    }
});

router.post("/create", async function(req, res) {
   const userData = req.body;
   const newUser = new UserModel(userData);
   await newUser.save(function(err) {
        if(err) {
            res.json({ success: false, message: err });
        }
        else {
            res.json({ success: true, message: "User created!" });
        }
   });
});

router.post("/search", async function(req, res) {
    const requestData = req.body;
    const foundUsers = await UserModel.find(
        { email: {
            $eq: requestData.email,
            $ne: requestData.myemail
        } },
    );
    res.json(foundUsers);
});

router.delete("/", async function(req, res) {
    const userData = req.body;
    const deleteResult = await UserModel.deleteOne(userData);
    if(deleteResult.deletedCount == 0) {
        res.json({ message: "No such user found!" });
    }
    else {
        res.json({ message: "User Deleted!" });
    }
});

module.exports = router;