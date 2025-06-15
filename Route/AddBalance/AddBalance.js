const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (AddBalanceRequestUserCollection) => {
    let router = express.Router()

    // All Payment Request Data Get
    // =====================================
    router.get("/AllAddBalanceRequestDataGet", async (req, res) => {
        const result = await AddBalanceRequestUserCollection.find().toArray();
        res.send(result)
    })
    // User send all payment request data post in database
    // ======================================================
    router.post('/userSendAddBalanceReq', async (req, res) => {
        const Balance = req.body;
        // console.log(Balance)
        const result = await AddBalanceRequestUserCollection.insertOne(Balance);
        res.send(result);
    });
    // Get User Payment Request Data All
    // ======================================================
    router.get('/UserAllAddBalanceReqData/:email', async (req, res) => {
        const Email = req.params.email;
        let query = { UserEmail : Email }
        const result = await AddBalanceRequestUserCollection.find(query).toArray();
        res.send(result);
    });
    // Admin Delete User Payment Request Data
    // ======================================================
    router.delete("/AdminDeleteUserAddBalanceReqData/:id",async(req,res)=>{
        let id = req.params.id
        let result = await AddBalanceRequestUserCollection.deleteOne({ _id: new ObjectId(id)})
        res.send(result)
    })
    // Admin Add Balance Data (Approved)
    // ======================================================
    router.patch("/AdminApprovedUserAddBalanceReqData/:id", async (req, res) => {
        let id = req.params.id;
        let query = { _id: new ObjectId(id) };
        let approved = { $set: { status: "Approved" } };
        let result = await AddBalanceRequestUserCollection.updateOne(query, approved);
        res.send(result);
    });
    // Admin Add Balance Data (Pending)
    // ======================================================
    router.patch("/AdminPendingUserAddBalanceReqData/:id", async (req, res) => {
        let id = req.params.id;
        let query = { _id: new ObjectId(id) };
        let approved = { $set: { status: "Pending" } };
        let result = await AddBalanceRequestUserCollection.updateOne(query, approved);
        res.send(result);
    });
        







    return router;
}