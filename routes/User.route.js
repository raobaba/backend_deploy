const express = require("express");
require('dotenv').config();
const { UserModel } = require("../models/User.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, pass, age } = req.body
    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            if (err) {
                console.log(err)
            } else {
                const user = new UserModel({ name, email, pass: hash, age })
                await user.save()
                res.send("Registered")
            }
        });
    } catch (err) {
        res.send("Error in registering the user")
        console.log(err)
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(pass, user[0].pass, (err, result) => {
                if (result) {
                    const token = jwt.sign({ userID:user[0]._id }, process.env.key);
                    res.send({ "msg": "Login Successfull", "token": token })
                } else {
                    res.send("Wrong Credntials")
                }
            })
        } else {
            res.send("Wrong Credntials")
        }
    } catch (err) {
        res.send("Something went wrong")
        console.log(err)
    }
})
module.exports = {
    userRouter
}