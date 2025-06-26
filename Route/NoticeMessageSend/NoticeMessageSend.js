const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (NoticeMessageSendAdminCollection) => {
    let router = express.Router()

    // All Notice Request Data Get
    // ==============================================
    router.get("/AllNoticeData", async (req, res) => {
        let result = await NoticeMessageSendAdminCollection.find().toArray()
        res.send(result)
    })
    // Admin Notice Message Request Send to Database
    // ==================================================
    router.post("/AdminSendNoticeMessage", async (req, res) => {
        let Standard = req.body
        let result = await NoticeMessageSendAdminCollection.insertOne(Standard)
        res.send(result)
    })








    return router;
}