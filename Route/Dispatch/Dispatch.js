const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = ({DispatchParcelCollection,UserTrackingMessageCollection}) => {
    let router = express.Router()

    // All Dispatch Request Data Get
    // ==============================================
    router.get("/AllDispatchRequestData", async (req, res) => {
        let result = await DispatchParcelCollection.find().toArray()
        res.send(result)
    })
    // Admin Dispatch Request  Post
    // ==============================================
    router.post("/AdminDispatchRequestSend", async (req, res) => {
        let Standard = req.body
        let result = await DispatchParcelCollection.insertOne(Standard)
        res.send(result)
    })
    // Admin Dispatch Data Delete
    // ==============================================
    router.delete("/AdminDeleteDispatchData/:id", async (req, res) => {
        let id = req.params.id
        let query = { _id : new ObjectId (id)}
        let result = await DispatchParcelCollection.deleteOne(query)
        res.send(result)
    })
    






    
    // Admin Tracking Message Post of Dispatch
    // =====================================================
    router.post("/AdminTrackingRequestSentOfDispatch", async (req, res) => {
        let TrackingMessage = req.body
        let result = await UserTrackingMessageCollection.insertMany(TrackingMessage)
        res.send(result)
    })
    



    return router;

}