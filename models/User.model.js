const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    email: String,
    pass: String,
    name: String,
    age: Number
})
const UserModel = mongoose.model("user", userSchema)
module.exports={
    UserModel
}