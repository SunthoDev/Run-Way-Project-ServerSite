const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = ({ AssignRiderCollection, UserTrackingMessageCollection, StandardDelivery }) => {
  let router = express.Router()

  // ====================================================================================================
  // Here is Assign parcel all work here !!
  // ====================================================================================================

  // Find All Assign Parcel which is assign to rider
  // ===============================================
  router.get("/AllAssignParcelFindToHere", async (req, res) => {
    const result = await AssignRiderCollection.find().toArray();
    res.send(result)
  })
  // Admin gave Assign Parcel to Rider 
  // ==========================================
  router.post('/InsertAssignParcelToRider', async (req, res) => {
    const Data = req.body;
    const result = await AssignRiderCollection.insertOne(Data);
    res.send(result);
  });
  // Admin Tracking Message Post of Assign Rider
  // =====================================================
  router.post("/AdminTrackingRequestSentOfAssignRider", async (req, res) => {
    let TrackingMessage = req.body
    let result = await UserTrackingMessageCollection.insertOne(TrackingMessage)
    res.send(result)
  })
  // Admin Update Parcel AssignRider Status (Yes)
  // =====================================================
  router.patch("/ParcelAssignStatusUpdateYes/:id", async (req, res) => {
    let upId = req.params.id
    // console.log(upId)
    let filter = { StandardParcelId: upId }
    let ApprovedParcel = {
      $set: {
        AssignRider: "Yes"
      },
    };
    let result = await StandardDelivery.updateOne(filter, ApprovedParcel)
    res.send(result)
  })


  // ====================================================================================================
  // Rider Parcel Approved And Change Status All Work Here!!
  // ====================================================================================================


  // Rider Parcel Status update after Delivery parcel
  // =====================================================
  router.patch("/RiderParcelDeliveryStatusUpdate/:id", async (req, res) => {
    let upId = req.params.id
    let upData = req.body

    let filter = { _id: new ObjectId(upId) }
    let ApprovedParcel = {
      $set: {
        status: upData.parcelStatus,
      }
    };
    let result = await StandardDelivery.updateOne(filter, ApprovedParcel)
    res.send(result)
  })

  // Delete assign request parcel when, rider will be update parcel status.
  // ======================================================================
  router.delete('/DeleteAssignParcel/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await AssignRiderCollection.deleteOne(query);
    res.send(result);
  });




























  return router;
}