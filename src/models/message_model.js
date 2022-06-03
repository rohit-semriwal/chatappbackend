const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    messageid: { type: String, required: true, unique: true },
    chatroomid: { type: String, required: true },
    msg: { type: String, required: true },
    sender: { type: String, default: "" },
    createdon: { type: Date, default: Date.now }
});

module.exports = model("Message", messageSchema);