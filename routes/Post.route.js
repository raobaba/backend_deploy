const express = require("express");
const { PostModel } = require("../models/Post.model.js");
const postRouter = express.Router();
postRouter.get("/", async (req, res) => {
    const query = req.query
    try {
        const post = await PostModel.find(query)
        res.send(post)
    } catch (error) {
        console.log(error);
        res.send({ "error": "Something went wrong !" });
    }
})

postRouter.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        const new_post = new PostModel(payload);
        await new_post.save();
        res.send("Created the Post");
    } catch (error) {
        console.log(err);
        res.send({ "message": "Something went wrong" });
    }
})
postRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body;
    const id = req.params.id;
    const note = await PostModel.findOne({ _id: id });
    console.log("This is the userID", note)
    const userID_in_post = note.userID;
    const userID_making_req = req.body.userID;
    try {
        if (userID_making_req !== userID_in_post) {
            res.send({ "message": "You are not authorized" });
        } else {
            await PostModel.findByIdAndUpdate({ _id: id }, payload);
            res.send("Updated the Post")
        }
    } catch (error) {
        console.log(error);
        res.send({ "message": "Something went wrong" })
    }
})
postRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const note = await PostModel.findOne({ _id: id });
    const userID_in_post = note.userID;
    const userID_making_req = req.body.userID;
    try {
        if (userID_making_req !== userID_in_post) {
            res.send({ "message": "You are not authorized" });
        } else {
            await PostModel.findByIdAndDelete({ _id: id });
            res.send("Deleted the Note")
        }
    } catch (error) {
        console.log(error);
        res.send({ "message": "Something went wrong" })
    }
})


module.exports = {
    postRouter
}