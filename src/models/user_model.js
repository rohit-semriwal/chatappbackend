const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userid: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdon: { type: Date, default: Date.now }
});

module.exports = model("User", userSchema);