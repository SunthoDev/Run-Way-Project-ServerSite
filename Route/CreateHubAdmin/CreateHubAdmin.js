const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = ({ CreateHubAdminCollection, HubPoliceStationAddAdminCollection }) => {
    let router = express.Router()

    // ====================================================================================================
    // Here is doing all of create hub work  (CreateHubAdminCollection) thi Collection
    // ====================================================================================================

    // Find All Created Hub
    // ==================================
    router.get("/CreatedHubFind", async (req, res) => {
        const result = await CreateHubAdminCollection.find().toArray();
        res.send(result)
    })
    // Post Hub Created to Database
    // ==================================
    router.post('/CreateHub', async (req, res) => {
        const Data = req.body;
        let query = { NameOfHub: Data.NameOfHub }
        let existingUser = await CreateHubAdminCollection.findOne(query)
        if (existingUser) {
            return res.send({ message: "Already existing this Hub" })
        }
        const result = await CreateHubAdminCollection.insertOne(Data);
        res.send(result);
    });
    // Delete Hub Name
    // ==================================
    router.delete('/HubNameDeleted/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await CreateHubAdminCollection.deleteOne(query);
        res.send(result);
    });






    // ====================================================================================================
    // Here is doing all, Police station add with Hub (HubPoliceStationAddAdminCollection) thi Collection
    // ====================================================================================================

    // Find All Hub Police Station
    // ==================================
    router.get("/PoliceStationWithOfHub", async (req, res) => {
        const result = await HubPoliceStationAddAdminCollection.find().toArray();
        res.send(result)
    })

    // Post Hub Police Station to Database
    // ====================================
    router.post('/CreatePoliceStationWithHub', async (req, res) => {
        const Data = req.body;

        let query = { PoliceStation: Data.PoliceStation }
        let existingUser = await HubPoliceStationAddAdminCollection.findOne(query)
        if (existingUser) {
            return res.send({ message: "Already existing this Police Station" })
        }
        const result = await HubPoliceStationAddAdminCollection.insertOne(Data);
        res.send(result);
    });
    // Delete Police Station of Hub
    // ==================================
    router.delete('/DeletedPoliceStationWithOfHub/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await HubPoliceStationAddAdminCollection.deleteOne(query);
        res.send(result);
    });





    return router;
}