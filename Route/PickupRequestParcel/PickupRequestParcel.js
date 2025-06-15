const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (UserPickupRequestCollection) => {
    let router = express.Router()


    // All Pickup Request Data Get
    // ==============================================
    router.get("/AllPickupRequestData", async (req, res) => {
        let result = await UserPickupRequestCollection.find().toArray()
        res.send(result)
    })
    // User Pickup Request Send Post
    // ==============================================
    router.post("/UserPickupRequestSend", async (req, res) => {
        let Standard = req.body
        let result = await UserPickupRequestCollection.insertOne(Standard)
        res.send(result)
    })
    // Admin My Pickup Request Data Approved
    // ==============================================
    router.put("/AdminApprovedUserPickupRequestData/:id", async (req, res) => {
        let upId = req.params.id
        let upData = req.body
        let filter = { _id: new ObjectId(upId) }
        let options = { upsert: true }
        let ApprovedParcel = {
            $set: {
                status: "Approved",
                parcelNum: upData.parcelNum
            },
        };
        let result = await UserPickupRequestCollection.updateOne(filter, ApprovedParcel, options)
        res.send(result)

    })
    // Admin My Pickup Request Data Pending
    // ==============================================
    router.patch("/AdminPendingUserPickupRequestData/:id", async (req, res) => {
        let upId = req.params.id
        let filter = { _id: new ObjectId(upId) }
        let ApprovedParcel = {
            $set: {
                status: "Pending"
            },
        };
        let result = await UserPickupRequestCollection.updateOne(filter, ApprovedParcel)
        res.send(result)

    })
    // Pickup Request All Data Find By a Email
    // ==============================================
    router.get("/PickupRequestAllDataFindByEmail", async (req, res) => {
        let query = {}
        if (req.query?.email) {
            query = { PickReqUserEmail: req.query.email }
        }
        let result = await UserPickupRequestCollection.find(query).toArray()
        res.send(result)
    })
    // Admin Delete Pickup Request Data
    // ==============================================
    router.delete('/AdminDeletePickupRequestData/:id', async (req, res) => {
        const id = req.params.id;
        // console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await UserPickupRequestCollection.deleteOne(query);
        res.send(result);
    });









    return router;
}