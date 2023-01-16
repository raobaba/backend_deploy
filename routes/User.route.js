const express = require("express");
require('dotenv').config();
const { UserModel } = require("../models/User.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password } = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                console.log(err)
            } else {
                const user = new UserModel({ name, email,gender, password: hash })
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
    const { email, password } = req.body
    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
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