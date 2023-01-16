const express = require("express");
const { NoteModel } = require("../models/Note.model.js");
const noteRouter = express.Router();
noteRouter.get("/", async (req, res) => {
    const query = req.query
    try {
        const user = await NoteModel.find(query)
        res.send(user)
    } catch (error) {
        console.log(error);
        res.send({ "error": "Something went wrong !" });
    }
})

noteRouter.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        const new_note = new NoteModel(payload);
        await new_note.save();
        res.send("Created the Note");
    } catch (error) {
        console.log(err);
        res.send({ "message": "Something went wrong" });
    }
})
noteRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body;
    const id = req.params.id;
    const note = await NoteModel.findOne({ _id: id });
    console.log("This is the userID", note)
    const userID_in_note = note.userID;
    const userID_making_req = req.body.userID;
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "message": "You are not authorized" });
        } else {
            await NoteModel.findByIdAndUpdate({ _id: id }, payload);
            res.send("Updated the Note")
        }
    } catch (error) {
        console.log(error);
        res.send({ "message": "Something went wrong" })
    }
})
noteRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const note = await NoteModel.findOne({ _id: id });
    const userID_in_note = note.userID;
    const userID_making_req = req.body.userID;
    try {
        if (userID_making_req !== userID_in_note) {
            res.send({ "message": "You are not authorized" });
        } else {
            await NoteModel.findByIdAndDelete({ _id: id });
            res.send("Deleted the Note")
        }
    } catch (error) {
        console.log(error);
        res.send({ "message": "Something went wrong" })
    }
})


module.exports = {
    noteRouter
}