const router = require('express').Router();
const ChatroomModel = require('./../models/chatroom_model');
const MessageModel = require('./../models/message_model');

router.post("/createroom", async function(req, res) {
    const requestData = req.body;

    // Check if already exists
    const foundChatroom = await ChatroomModel.findOne({ participants: { $all: requestData.participants } });
    if(foundChatroom) {
        res.json({ success: true, data: foundChatroom });
        return;
    }

    const newChatroom = new ChatroomModel(requestData);
    await newChatroom.save(function(err) {
        if(err) {
            res.json({ success: false, message: err });
        }
        else {
            res.json({ success: true, data: newChatroom });
        }
    });
});

router.post("/deleteroom", async function(req, res) {
    const requestData = req.body;
    const deleteResult = await ChatroomModel.deleteOne(requestData);
    if(deleteResult.deletedCount == 0) {
        res.json({ success: false, message: "No such chatroom found!" });
    }
    else {
        res.json({ success: true, message: "Chatroom deleted!" });
    }
});

router.post("/sendmessage", async function(req, res) {
    const messageData = req.body;

    const foundChatroom = await ChatroomModel.findOne({ chatroomid: messageData.chatroomid });
    if(foundChatroom) {
        const newMessage = new MessageModel(messageData);
        await newMessage.save(function(err) {
            if(err) {
                res.json({ success: false, message: err });
            }
            else {
                res.json({ success: true, message: "Message Sent!" });
            }
        });
    }
    else {
        res.json({ success: false, message: "No chatroom found!" });
    }
});

router.post("/deletemessage", async function(req, res) {
    const requestData = req.body;
    const deleteResult = await MessageModel.deleteMany(requestData);
    if(deleteResult.deletedCount == 0) {
        res.json({ success: false, message: "No such message found!" });
    }
    else {
        res.json({ success: true, message: "Message Deleted!" });
    }
});

router.post("/fetchmessages", async function(req, res) {
    const requestData = req.body;
    const foundMessages = await MessageModel.find({ chatroomid: requestData.chatroomid });
    res.json(foundMessages);
});

module.exports = router;