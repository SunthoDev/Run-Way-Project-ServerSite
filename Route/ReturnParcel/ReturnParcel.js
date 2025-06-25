const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = ({ ReturnParcelCollection, UserTrackingMessageCollection }) => {
    let router = express.Router()

    // All Return Parcel Request Data Get
    // ==============================================
    router.get("/AllReturnParcelRequestData", async (req, res) => {
        let result = await ReturnParcelCollection.find().toArray()
        res.send(result)
    })
    // User Return Parcel Request Send Post
    // ==============================================
    router.post("/UserReturnRequestSend", async (req, res) => {
        let Standard = req.body
        let result = await ReturnParcelCollection.insertOne(Standard)
        res.send(result)
    })
    // Admin Delete Return Parcel Request
    // ==============================================
    router.delete("/AdminDeleteReqOfReturnParcel/:id", async (req, res) => {
        let id = req.params.id
        let query = { _id: new ObjectId(id)}
        let result = await ReturnParcelCollection.deleteOne(query)
        res.send(result)
    })




    // Admin Tracking Message Post of Dispatch
    // =====================================================
    router.post("/AdminTrackingRequestSentOfReturnParcel", async (req, res) => {
        let TrackingMessage = req.body
        let result = await UserTrackingMessageCollection.insertMany(TrackingMessage)
        res.send(result)
    })


    return router;
}