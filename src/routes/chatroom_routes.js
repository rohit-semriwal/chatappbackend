const router = require('express').Router();
const ChatroomModel = require('./../models/chatroom_model');
const MessageModel = require('./../models/message_model');

router.post("/createroom", async function(req, res) {
    const requestData = req.body;

    // Check if already exists
    const foundChatroom = await ChatroomModel.findOne({ participants: { $all: requestData.participants } }).populate("participants lastmessage");
    if(foundChatroom) {
        res.json({ success: true, data: foundChatroom });
        return;
    }

    const newChatroom = new ChatroomModel(requestData);
    await newChatroom.save(async function(err) {
        if(err) {
            res.json({ success: false, message: err });
        }
        else {
            const populatedChatroom = await ChatroomModel.findOne({ chatroomid: newChatroom.chatroomid }).populate("participants lastmessage");
            res.json({ success: true, data: populatedChatroom });
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
    res.json({ success: true, data: foundMessages });
});

router.get("/:userid", async function(req, res) {
    const userid = req.params.userid;
    const foundChatrooms = await ChatroomModel.find({ participants: userid }).populate("participants lastmessage");
    res.json({ success: true, data: foundChatrooms });
});

module.exports = router;