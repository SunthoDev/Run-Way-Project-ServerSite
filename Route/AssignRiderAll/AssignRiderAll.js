const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = ({ AssignRiderCollection, UserTrackingMessageCollection, StandardDelivery, ParcelDeliveryHistoryOfRiderCollection, userCollection, ParcelCODRequestHistoryCollection }) => {
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

  // Rider Save his Parcel History after Delivery Parcel
  // =====================================================
  router.post('/ParcelDeliveryHistoryOfRider', async (req, res) => {
    const Data = req.body;
    const result = await ParcelDeliveryHistoryOfRiderCollection.insertOne(Data);
    res.send(result);
  });

  // Parcel COD amount increase rider balance
  // =====================================================
  router.put("/ParcelCODAmountIncreaseRiderBalance/:email", async (req, res) => {
    const upEmail = req.params.email;
    const upAmount = req.body;

    let filter = { email: upEmail }
    let options = { upsert: true }

    let IncreaseParcelCodeAmount = {
      $inc: {
        ParcelCODAmountOfRider: upAmount?.ParcelCod || 0
      }
    }
    let result = await userCollection.updateOne(filter, IncreaseParcelCodeAmount, options)
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


  // ====================================================================================================
  // Rider Panel (Parcel Information Route) All work Here !!
  // ====================================================================================================


  // Parcel Collected COD Request All Data Find
  // ===============================================
  router.get("/ParcelCollectCODRequestAllDataFind", async (req, res) => {
    const result = await ParcelCODRequestHistoryCollection.find().toArray();
    res.send(result)
  })
  // Parcel Collected COD Request Send To Admin 
  // =====================================================
  router.post('/ParcelCollectAllCodRequestSend', async (req, res) => {
    const Data = req.body;
    const result = await ParcelCODRequestHistoryCollection.insertOne(Data);
    res.send(result);
  });
  // Rider When Send a COD Request then his COD balance will be 0 
  // =====================================================================
  router.patch("/RiderParcelCODAmountWillBeZero/:email", async (req, res) => {
    let upEmail = req.params.email;
    let filter = { email: upEmail }
    let UpdateCodeAmount = {
      $set: {
        ParcelCODAmountOfRider: 0
      }
    }
    let result = await userCollection.updateOne(filter, UpdateCodeAmount)
    res.send(result)
  })
  // Admin Approved Rider Parcel COD Request
  // =====================================================================
  router.patch("/AdminRiderParcelCodeReqAmountStatusApproved/:id", async (req, res) => {
    let id = req.params.id;
    console.log(id)
    let query = { _id: new ObjectId(id) }
    let UpdateCodeAmountReqStatus = {
      $set: {
        status: "Approved"
      }
    }
    let result = await ParcelCODRequestHistoryCollection.updateOne(query, UpdateCodeAmountReqStatus)
    res.send(result)
  })
















  return router;
}