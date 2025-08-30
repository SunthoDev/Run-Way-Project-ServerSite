const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = ({ AssignRiderCollection, UserTrackingMessageCollection, StandardDelivery, ParcelDeliveryHistoryOfRiderCollection, userCollection, ParcelCODRequestHistoryCollection,ReturnParcelCollection, UserPickupRequestCollection }) => {
  let router = express.Router()

   // ============================================================================================================
                                          // USER PANEL (Parcel-Assign)
  // =============================================================================================================
  // ============================================================================================================
  // Here is (Single) Assign parcel all work here !!
  // ============================================================================================================
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

  // ============================================================================================================
  // Here is (Multiple) Assign parcel all work here !!
  // ============================================================================================================
  // Admin gave Assign Parcel to Rider (Multiple)
  // ================================================
  router.post('/InsertAssignParcelToRiderMultiple', async (req, res) => {
    const Data = req.body;
    const result = await AssignRiderCollection.insertMany(Data);
    res.send(result);
  });
  // Admin Tracking Message Post of Assign Rider (Multiple)
  // =====================================================
  router.post("/AdminTrackingRequestSentOfAssignRiderMultiple", async (req, res) => {
    let TrackingMessage = req.body;
    let result = await UserTrackingMessageCollection.insertMany(TrackingMessage)
    res.send(result)
  })
  // Admin Update Parcel AssignRider Status (Yes) (Multiple)
  // =========================================================
  router.patch("/ParcelAssignStatusUpdateYesMultiple", async (req, res) => {
    let ids = req.body.ids.map(String);
    // console.log(upId)
    let filter = { StandardParcelId: { $in: ids } };
    let ApprovedParcel = {
      $set: {
        AssignRider: "Yes"
      },
    };
    let result = await StandardDelivery.updateMany(filter, ApprovedParcel)
    res.send(result)
  })

  // ============================================================================================================
                                   // USER PANEL (Return-Parcel-Assign)
  // =============================================================================================================
  // Admin gave (Return) Parcel Assign to Rider 
  // ============================================
  router.post('/InsertAssignReturnParcelToRider', async (req, res) => {
    const Data = req.body;
    const result = await AssignRiderCollection.insertOne(Data);
    res.send(result);
  });
  // Admin Tracking Message Post of (Return) Parcel Assign to Rider  (Multiple)
  // ===========================================================================
  router.post("/AdminTrackingRequestSentOfReturnParcelAssignRiderMultiple", async (req, res) => {
    let TrackingMessage = req.body;
    let result = await UserTrackingMessageCollection.insertMany(TrackingMessage)
    res.send(result)
  })
  // Admin Update (Return) Parcel Status (HandHover) Rider
  // =========================================================
  router.patch("/ReturnParcelAssignStatusUpdateHandHoverRider/:id", async (req, res) => {
    let Id = req.params.id;
    // console.log(upId)
    let filter = { ReturnId: Id };
    let ApprovedParcel = {
      $set: {
        ReturnStatus: "HandHoverRider"
      },
    };
    let result = await ReturnParcelCollection.updateOne(filter, ApprovedParcel)
    res.send(result)
  })
  // ============================================================================================================
                               // USER PANEL (PICKUP_Request-Assign)
  // =============================================================================================================
  // Admin gave Pickup Request Parcel Assign to Rider 
  // =================================================
  router.post('/InsertAssignPickupRequestToRider', async (req, res) => {
    const Data = req.body;
    const result = await AssignRiderCollection.insertOne(Data);
    res.send(result);
  });
  // Admin Update Pickup Request AssignRider Status (Yes) 
  // =========================================================
   router.patch("/PickupRequestAssignStatusUpdateYes/:id", async (req, res) => {
    let upId = req.params.id
    // console.log(upId)
    let filter = { PickupIdUser: upId }
    let ApprovedParcel = {
      $set: {
        AssignRider: "Yes"
      },
    };
    let result = await UserPickupRequestCollection.updateOne(filter, ApprovedParcel)
    res.send(result)
  })


  // ============================================================================================================
                                             // RIDER PANEL
  // ============================================================================================================
  // ============================================================================================================
  // Rider Parcel Approved And Change Status All Work Here!!
  // ============================================================================================================
  // Rider Parcel Delivery History Find All
  // ===============================================
  router.get("/ParcelDeliveryHistoryAllDataFind", async (req, res) => {
    const result = await ParcelDeliveryHistoryOfRiderCollection.find().toArray();
    res.send(result)
  })

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

  // ============================================================================================================
  // Rider Panel ((Return) Parcel Information Route) All work Here !!
  // ============================================================================================================
  // Rider Update (Return) Parcel Status (Approved) Rider
  // =========================================================
  router.patch("/ReturnParcelApprovedToRiderAfterDelivery/:id", async (req, res) => {
    let Id = req.params.id;
    // console.log(upId)
    let filter = { ReturnId: Id };
    let ApprovedParcel = {
      $set: {
        ReturnStatus: "Approved"
      },
    };
    let result = await ReturnParcelCollection.updateOne(filter, ApprovedParcel)
    res.send(result)
  })

  // Rider Tracking Message Post of (Return) Parcel success return (Multiple)
  // ===========================================================================
  router.post("/RiderTrackingRequestSentOfReturnParcelSuccessReturnMultiple", async (req, res) => {
    let TrackingMessage = req.body;
    let result = await UserTrackingMessageCollection.insertMany(TrackingMessage)
    res.send(result)
  })

  // Rider delete return assign parcel request  when, rider will be update return parcel status.
  // =============================================================================================
  router.delete('/DeleteReturnAssignParcel/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await AssignRiderCollection.deleteOne(query);
    res.send(result);
  });

  // ============================================================================================================
  // Rider Panel ((Pickup Request) Information Route) All work Here !!
  // ============================================================================================================











  



  // ============================================================================================================
  // Rider Panel (Parcel Information Route) All work Here !!
  // ============================================================================================================
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
    let query = { _id: new ObjectId(id) }
    let UpdateCodeAmountReqStatus = {
      $set: {
        status: "Approved"
      }
    }
    let result = await ParcelCODRequestHistoryCollection.updateOne(query, UpdateCodeAmountReqStatus)
    res.send(result)
  })
  // Admin Delete Rider Parcel COD Request
  // =====================================================================
  router.delete("/AdminRiderParcelCodeReqAmountDelete/:id", async (req, res) => {
    let id = req.params.id;
    let query = { _id: new ObjectId(id) }
    let result = await ParcelCODRequestHistoryCollection.deleteOne(query)
    res.send(result)
  })

  // ============================================================================================================
  // ============================================================================================================















  return router;
}