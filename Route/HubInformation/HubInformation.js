const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = ( HubInformationCollection ) => {
  let router = express.Router()

  // ====================================================================================================
  // All Hub Information Save here !!
  // ====================================================================================================

  // Find All Hub Information
  // ===============================================
  router.get("/AllHubInformationData", async (req, res) => {
    const result = await HubInformationCollection.find().toArray();
    res.send(result)
  })
  // Admin POST Hub Information Data
  // ==========================================
  router.post('/PostHubInformation', async (req, res) => {
    const Data = req.body;
    const result = await HubInformationCollection.insertOne(Data);
    res.send(result);
  });
  // Admin Delete Hub Information
  // ======================================
  router.delete('/DeleteHubInformation/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await HubInformationCollection.deleteOne(query);
    res.send(result);
  });
























    return router;
  }