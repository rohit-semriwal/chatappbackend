const { Schema, model } = require('mongoose');

const chatroomSchema = new Schema({
    chatroomid: { type: String, required: true, unique: true },
    participants: { type: [ {type: Schema.Types.ObjectId, ref: "User"} ] },
    lastmessage: { type: Schema.Types.ObjectId, ref: "Message" },
    createdon: { type: Date, default: Date.now }
});

module.exports = model("Chatroom", chatroomSchema);