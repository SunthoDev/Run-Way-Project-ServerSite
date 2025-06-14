require('dotenv').config()
const express = require("express");
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000

// ===============================

// middleware
app.use(cors())
app.use(express.json())
// ================================



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.ENV_NAME}:${process.env.ENV_PASSWORD}@cluster0.qzzmb4j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // ============================================================
    // User Collections Name
    // ============================================================

    const userCollection = client.db("ShipProjects").collection("user")
    const StandardDelivery = client.db("ShipProjects").collection("StandardDelivery")
    const CoverageAllDistrictCollection = client.db("ShipProjects").collection("CoverageAllDistrict")
    const CoverageAllPoliceStation = client.db("ShipProjects").collection("CoverageAllPoliceStation")
    const UserPaymentRequestCollection = client.db("ShipProjects").collection("UserPaymentRequest")
    const UserPickupRequestCollection = client.db("ShipProjects").collection("UserPickupRequest")
    const UserTrackingMessageCollection = client.db("ShipProjects").collection("UserTrackingMessage")

    const AddBalanceRequestUserCollection = client.db("ShipProjects").collection("AddBalanceRequestUser")

    const CreateHubAdminCollection = client.db("ShipProjects").collection("AllHubCreate")
    const HubPoliceStationAddAdminCollection = client.db("ShipProjects").collection("AllHubPoliceStationAdd")
    
    const DispatchParcelCollection = client.db("ShipProjects").collection("DispatchAllData")

    // ======================================================================================================
    // Connect all folder code of route Start
    // =========================================================

    // User send add balance request 
    // ==========================================
    const AddBalanceReq = require("./Route/AddBalance/AddBalance")(AddBalanceRequestUserCollection);
    app.use("/UserAddBalanceReq", AddBalanceReq);

    // Admin Create Hub || with Hub Update by Police Station
    // ======================================================
    const CreateHub = require("./Route/CreateHubAdmin/CreateHubAdmin")({CreateHubAdminCollection,HubPoliceStationAddAdminCollection});
    app.use("/HubManageAdminCreateOrUpdatePs", CreateHub);
    
    // Pickup Request with handle (Admin) / (Users)
    // ======================================================
    const PickupRequest = require("./Route/PickupRequestParcel/PickupRequestParcel")(UserPickupRequestCollection);
    app.use("/PickupRequestWithManegeAdminUsers", PickupRequest);

    // Dispatch Data Work ?? With Tracking Message Sent
    // ====================================================
    const DispatchRequest = require("./Route/Dispatch/Dispatch")({DispatchParcelCollection,UserTrackingMessageCollection})
    app.use("/DispatchAllRequestWithTrackingMessage",DispatchRequest);







    // =========================================================
    // Connect all folder code of route End
    // ======================================================================================================

    // get all user Admin Dashboarde __________________________

    app.get("/users", async (req, res) => {
      let result = await userCollection.find().toArray()
      res.send(result)
    })
    // Admin Update User Status __________________________
    app.patch("/AdminApprovedNewUser/:id", async (req, res) => {

      let upId = req.params.id
      // console.log(upId)
      let filter = { _id: new ObjectId(upId) }
      let ApprovedParcel = {
        $set: {
          status: "approved"
        },
      };
      let result = await userCollection.updateOne(filter, ApprovedParcel)
      res.send(result)

    })



    // Admin Update User Role Admin __________________________
    app.patch("/AdminUpdateRoleAdmin/:id", async (req, res) => {
      let upId = req.params.id
      let filter = { _id: new ObjectId(upId) }
      let updateAdmin = {
        $set: {
          role: "admin"
        }
      }
      let result = await userCollection.updateOne(filter, updateAdmin)
      res.send(result)
    })
    // Admin Update User Role User __________________________
    app.patch("/AdminUpdateRoleUser/:id", async (req, res) => {
      let upId = req.params.id
      let filter = { _id: new ObjectId(upId) }
      let updateAdmin = {
        $set: {
          role: "user"
        }
      }
      let result = await userCollection.updateOne(filter, updateAdmin)
      res.send(result)
    })
    // Admin Update User Role Rider __________________________
    app.patch("/AdminUpdateRoleRider/:id", async (req, res) => {
      let upId = req.params.id
      let filter = { _id: new ObjectId(upId) }
      let updateAdmin = {
        $set: {
          role: "rider"
        }
      }
      let result = await userCollection.updateOne(filter, updateAdmin)
      res.send(result)
    })
    // Admin Update User Role Sub Admin __________________________
    app.patch("/AdminUpdateRoleSubAdmin/:id", async (req, res) => {
      let upId = req.params.id
      let filter = { _id: new ObjectId(upId) }
      let updateAdmin = {
        $set: {
          role: "subAdmin"
        }
      }
      let result = await userCollection.updateOne(filter, updateAdmin)
      res.send(result)
    })

    // Admin Update User Role Sub Admin __________________________
    app.delete("/AdminDeleteUsers/:id", async (req, res) => {
      let upId = req.params.id
      let query = { _id: new ObjectId(upId) }
      let result = await userCollection.deleteOne(query)
      res.send(result)
    })



    // SingUp and github or google new login user data saved Database __________________________

    app.post("/users", async (req, res) => {
      let user = req.body

      let query = { email: user.email }
      let existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: "Already existing user" })
      }

      let result = await userCollection.insertOne(user)
      res.send(result)
    })


    // check user role show Dashboard _________________________________________

    app.get("/userRoleCheck/:email", async (req, res) => {
      let email = req.params.email
      // console.log(email)
      let query = { email: email }
      let result = await userCollection.findOne(query)
      // console.log(result)
      res.send(result)
    })

    // user delete Dashboard _________________________________________

    //   app.delete('/usersDelete/:id', async (req, res) => {
    //     let deleteId = req.params.id
    //     let query = { _id: new ObjectId(deleteId) }
    //     let result = await userCollection.deleteOne(query)
    //     res.send(result)

    //   })



    // ==============================================================================
    //              User Parcel Work
    // ==============================================================================

    // Add Parcel, standard parcel data add Database _________________________________________
    app.post("/StandardDeliveryData", async (req, res) => {
      let Standard = req.body
      let result = await StandardDelivery.insertOne(Standard)
      res.send(result)
    })

    // Add Parcel,, standard parcel data get Database _________________________________________

    app.get("/StandardDeliveryData", async (req, res) => {
      let query = {}
      if (req.query?.StandardParcelId) {
        query = { StandardParcelId: req.query.StandardParcelId }
      }
      let result = await StandardDelivery.findOne(query)
      res.send(result)
    })





    // user AllConsignment all Data find Finde  _________________________________________

    app.get("/UseAllConsignmentStandardData", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })

    // user AllConsignment pending data invoice get  _________________________________________

    app.get("/UserConsignmentPendingInvoice/:id", async (req, res) => {
      let id = req.params.id
      // console.log(id)
      let query = { _id: new ObjectId(id) }
      let result = await StandardDelivery.findOne(query)
      res.send(result)
    })


    // user AllConsignment pending Invoice Update data get  _________________________________________

    app.get("/UserConsignmentPendingInvoiceUpdate/:id", async (req, res) => {
      let id = req.params.id
      // console.log(id)
      let query = { _id: new ObjectId(id) }
      let result = await StandardDelivery.findOne(query)
      res.send(result)
    })

    // user AllConsignment pending Invoice Update Now Data  _________________________________________

    app.patch("/UserConsignmentPendingInvoiceUpdateData/:id", async (req, res) => {
      let upId = req.params.id
      let upData = req.body
      // console.log(upId)
      // console.log(upData)

      let filter = { _id: new ObjectId(upId) }
      let ApprovedParcel = {
        $set: {
          number: upData.number,
          name: upData.name,
          address: upData.address,
          district: upData.district,
          policeStation: upData.policeStation,
          CodAmount: upData.CodAmount,
          Invoice: upData.Invoice,
          note: upData.note,
          weight: upData.weight,
        }
      };
      let result = await StandardDelivery.updateOne(filter, ApprovedParcel)
      res.send(result)
    })



    // user All Amount change all Data find  _________________________________________

    app.get("/UseAllAmountChangeDataGet", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })



    // User Total balance Amount. Find All delivery data get______________________________

    app.get("/UserTotalBalanceFindDeliveryAllData", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })



    // user All Cancel standard delivery data find  _________________________________________

    app.get("/UseAllCancelStandardData", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })

    // User Payment Request Send. Update Payment Status All Data
    // ===================================================================

    app.put("/UserPaymentRequestUpdateAllData/:email", async (req, res) => {

      let upEmail = req.params.email
      let upData = req.body
      let query = { StandardEmailUser: upEmail }
      let UserAllData = await StandardDelivery.find(query).toArray()

      let CodAmountPaymentData = UserAllData.filter(PaymentAll => PaymentAll?.Payment == "Yes" && PaymentAll?.status == "Delivered" || PaymentAll?.Payment == "Yes" && PaymentAll?.status == "PartiallyDelivered")
      // console.log(CodAmountPaymentData)

      let x = CodAmountPaymentData.map(pp => new ObjectId(pp._id))

      let filter = { _id: { $in: x } }
      let options = { upsert: true }


      let ApprovedParcel = {
        $set: {
          Payment: "Paid",
          PaymentID: upData.PaymentID
        },
      };
      let result = await StandardDelivery.updateMany(filter, ApprovedParcel, options)
      res.send(result)

    })


    // =============================================================
    // User Payment Request Send. Post Payment Request Data
    // ===================================================================
    app.post("/UserPaymentRequest", async (req, res) => {
      let Standard = req.body
      let result = await UserPaymentRequestCollection.insertOne(Standard)
      res.send(result)
    })



    // user Bank Information Add.. Get User Information
    //  _______________________________________________________________

    app.get("/UserBankDetailsAddGetUserData/:id", async (req, res) => {
      let id = req.params.id
      // console.log(id)
      let query = { userId: id }
      let result = await userCollection.findOne(query)
      res.send(result)
    })


    // user Bank Information Add And Update Bank Information..
    //  _________________________________________
    app.put("/UserBankDetailsAddAndUpdate/:id", async (req, res) => {

      let upId = req.params.id
      let upData = req.body
      // console.log(upId)
      // console.log(upData)
      let filter = { _id: new ObjectId(upId) }
      let options = { upsert: true }
      let AddBankDetails = {
        $set: {
          BankName: upData.BankName,
          AccountName: upData.AccountName,
          AccountNumber: upData.AccountNumber,
          BranchName: upData.BranchName,
          RoutingNo: upData.RoutingNo,
          BakashNo: upData.BakashNo,
          RocketNo: upData.RocketNo,
          NagadNo: upData.NagadNo

        },
      };
      let result = await userCollection.updateOne(filter, AddBankDetails, options)
      res.send(result)

    })

    // user All Payment Request Data find  _________________________________________

    app.get("/UseAllPaymentRequestDataGetAll", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { ReqUserEmail: req.query.email }
      }
      let result = await UserPaymentRequestCollection.find(query).toArray()
      res.send(result)

    })



    // =========================================================================================
    // All Parcel Standard Delivery invoice temporory
    // =========================================================================================

    app.get("/StandardDeliveryDataTemporory", async (req, res) => {
      let query = {}
      if (req.query?.StandardParcelId) {
        query = { StandardParcelId: req.query.StandardParcelId }
      }
      let result = await StandardDelivery.findOne(query)
      res.send(result)
    })


    //  User Payment Request Data find
    // _______________________________________________________________________________

    app.get("/UserPaymentDetailUnikDataFind/:id", async (req, res) => {
      let id = req.params.id
      // console.log(id)
      let query = { _id: new ObjectId(id) }
      let result = await UserPaymentRequestCollection.findOne(query)
      res.send(result)
    })










    // ==============================================================================
    // Admin Parcel Work
    // ==============================================================================

    // user id search admin Dashboard
    // _______________________________________________________________________________

    app.get("/adminSearchUserId", async (req, res) => {

      let query = {}

      if (req.query?.userId) {
        query = { userId: req.query.userId }
      }

      // let existingUser = await userCollection.findOne(query)
      // if (existingUser.userId !== req.query?.userId) {
      //   return res.send({ message: "Your UnValid Id Numbers " })
      // }

      let result = await userCollection.findOne(query)
      res.send(result)
    })

    // user Number search admin Dashboard
    // _______________________________________________________________________________

    app.get("/adminSearchUserNumber", async (req, res) => {

      let query = {}

      if (req.query?.userNumber) {
        query = { Phone: req.query.userNumber }
      }

      // let existingUser = await userCollection.findOne(query)
      // if (existingUser.userId !== req.query?.userId) {
      //   return res.send({ message: "Your UnValid Id Numbers " })
      // }

      let result = await userCollection.findOne(query)
      res.send(result)
    })






    // Admin search user standard Parcel id  Dashboard 
    // __________________________________________________________________________________

    app.get("/AdminSearchStandardParcelId", async (req, res) => {

      let query = {}

      if (req.query?.StandardParcelId) {
        query = { StandardParcelId: req.query.StandardParcelId }
      }

      // let existingUser = await userCollection.findOne(query)
      // console.log(existingUser)
      // if (existingUser.userId !== req.query?.userId) {
      //   return res.send({ message: "Your UnValid Id Numbers " })
      // }

      let result = await StandardDelivery.findOne(query)
      res.send(result)
    })

    // Admin User Order Invoice Update 
    // =============================================================

    app.put("/AdminUserOrderInvoiceUpdate/:id", async (req, res) => {

      let upId = req.params.id
      let upData = req.body
      let filter = { _id: new ObjectId(upId) }
      let options = { upsert: true }

      let AdminUpUserInvoiceOrder = {
        $set: {
          name: upData.nameUp,
          weight: upData.WeightUp,
          policeStation: upData.policeStationUp,
          number: upData.numberUp,
          note: upData.noteUp,
          address: upData.addressUp,
          District: upData.districtUp,
          CodAmount: upData.CodAmountUp,
          DeliveryCharge: upData.DeliveryChargeUp,
          Invoice: upData.InvoiceUP
        },
      };
      let result = await StandardDelivery.updateOne(filter, AdminUpUserInvoiceOrder, options)
      res.send(result)

    })


    // Admin was send tracking message many id   
    // =============================================================

    app.post("/AdminTrackingSendMessage", async (req, res) => {
      let trackingMeId = req.body
      let { mes1, mes2, mes3, mes4, mes5, mes6, mes7, mes8, mes9, mes10, mes11, mes12, mes13, mes14, mes15, mes16, mes17, mes18, TrackingMessage, TrackingDate } = trackingMeId
      // console.log(mes1,mes2,TrackingMessage)
      let TrackingManyData = [
        { userOrderIdTracking: mes1, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes2, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes3, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes4, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes5, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes6, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes7, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes8, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes9, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes10, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes11, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes12, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes13, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes14, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes15, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes16, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes17, TrackingMessage, TrackingDate },
        { userOrderIdTracking: mes18, TrackingMessage, TrackingDate },
      ]
      let insertTrackingData = []

      for (var item of TrackingManyData) {
        if (item.userOrderIdTracking !== "") {
          insertTrackingData.push(item)
        }
      }
      // console.log(insertTrackingData)
      let result = await UserTrackingMessageCollection.insertMany(insertTrackingData)
      // console.log(result)
      res.send(result)
    })

    // =============================================================

    // Admin is get tracking message all   
    // =============================================================
    app.get("/AllTrackingData", async (req, res) => {
      let result = await UserTrackingMessageCollection.find().toArray()
      res.send(result)
    })

























    //================================================================================TODO
    // Admin Data Entry jano , User email find all standard Delivery data  
    // _______________________________________________________________________________TODO Data load plm

    app.get("/AdminDataEntryStandardDeliveryData", async (req, res) => {
      console.log(req.query?.email)


      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })

    // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    // app.get("/xxxxxxxxx", async (req, res) => {
    //   console.log(req.query?.email)


    //   let query = {}
    //   if (req.query?.email) {
    //     query = { StandardEmailUser: req.query.email }
    //   }
    //   let result = await StandardDelivery.find(query).toArray()
    //   res.send(result)

    // })

    // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    //================================================================================TODO



    // Add Admin Entry, user standard parcel data add Database _________________________________________
    app.post("/AdminEntryStandardDeliveryData", async (req, res) => {
      let Standard = req.body
      let result = await StandardDelivery.insertOne(Standard)
      res.send(result)
    })

    // Admin Approved, user standard parcel data Data Entry _________________________________________
    app.put("/AdminApprovedUserStandardData/:id", async (req, res) => {

      let upId = req.params.id
      let upData = req.body


      let filter = { _id: new ObjectId(upId) }
      let options = { upsert: true }
      let ApprovedParcel = {
        $set: {
          status: "Pending",
          ApprovedOffice: upData.ApprovedOffice,
          ApprovedName: upData.ApprovedName,
          ApprovedDate: upData.PendingDate

        },
      };
      let result = await StandardDelivery.updateOne(filter, ApprovedParcel, options)
      res.send(result)

    })

    // Admin Update, user standard parcel data (Update) _________________________________________
    app.patch("/AdminUpdateUserStandardData/:id", async (req, res) => {
      let upId = req.params.id
      let upData = req.body
      // console.log(upId)
      // console.log(upData)
      let filter = { _id: new ObjectId(upId) }
      let ApprovedParcel = {
        $set: {
          District: upData.district,
          policeStation: upData.PoliceStation,
          weight: upData.Weight
        },
      };
      let result = await StandardDelivery.updateOne(filter, ApprovedParcel)
      res.send(result)
    })


    // Admin user id find, And Consignment user Standard Parcel Find  All
    // _______________________________________________________________________________

    app.get("/AdminConsignmentUserStandardDataFind", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })

    // Admin Consignment pending user Standard Parcel invoice data
    // _______________________________________________________________________________

    app.get("/AdminSearchConsignmentInvoice/:id", async (req, res) => {
      let id = req.params.id
      // console.log(id)

      let query = { _id: new ObjectId(id) }
      let result = await StandardDelivery.findOne(query)
      res.send(result)
    })

    // =======================
    // Admin user Consignment pending user Standard Parcel invoice Edite Update Data Get ..
    // _______________________________________________________________________________

    app.get("/AdminConsignmentPendingInvoiceUpdate/:id", async (req, res) => {
      let id = req.params.id
      // console.log(id)
      let query = { _id: new ObjectId(id) }
      let result = await StandardDelivery.findOne(query)
      res.send(result)
    })


    // Admin user Consignment pending  Standard Parcel invoice Edite Update and status..
    // _______________________________________________________________________________

    app.patch("/AdminConsignmentPendingInvoiceUpdateData/:id", async (req, res) => {
      let upId = req.params.id
      let upData = req.body
      // console.log(upId)
      // console.log(upData)

      let filter = { _id: new ObjectId(upId) }
      let ApprovedParcel = {
        $set: {
          number: upData.number,
          name: upData.name,
          address: upData.address,
          District: upData.district,
          policeStation: upData.policeStation,
          Invoice: upData.Invoice,
          note: upData.note,
          weight: upData.weight,
          DeliveryCharge: upData.Charge,
          status: upData.statusUp,
        }
      };
      let result = await StandardDelivery.updateOne(filter, ApprovedParcel)
      res.send(result)
    })


    // Admin Consignment pending  Standard Parcel invoice Amount Update
    // _______________________________________________________________________

    app.put("/AdminConsignmentPendingInvoiceAmountChange/:id", async (req, res) => {

      let upId = req.params.id
      let upData = req.body
      // console.log(upId)
      // console.log(upData)


      let filter = { _id: new ObjectId(upId) }
      let options = { upsert: true }
      let ApprovedParcel = {
        $set: {

          AmountChangeDate: upData.AmountChangeDate,
          AmountChangeAdminStatus: upData.AmountChangeAdminStatus,
          CodAmount: upData.CodAmount

        },
      };
      let result = await StandardDelivery.updateOne(filter, ApprovedParcel, options)
      res.send(result)

    })








    // TODO
    // Admin user id find, And Consignment user Standard Parcel Find  All
    // _______________________________________________________________________________

    app.get("/AdminCurrentBalanceAllData", async (req, res) => {

      // console.log(req.query?.email)
      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })










    // Admin All Parcel Find.. Approved Parcel
    // _______________________________________________________________________________
    app.get("/AdminAllStandardDeliveryDataFind", async (req, res) => {
      let result = await StandardDelivery.find().toArray()
      res.send(result)
    })


    // Admin Approved Parcel Standard delivery data..Update Payment yes
    // _______________________________________________________________________________
    app.patch("/AdminApprovedParcelStandardDataYesPayment/:id", async (req, res) => {

      let upId = req.params.id
      // console.log(upId)
      let filter = { _id: new ObjectId(upId) }
      let ApprovedParcel = {
        $set: {
          Payment: "Yes"
        },
      };
      let result = await StandardDelivery.updateOne(filter, ApprovedParcel)
      res.send(result)

    })


    // Admin Approved Pending Parcel Data, Back Pending
    // _______________________________________________________________________________
    app.patch("/AdminConsignmentApprovedPendingDataBackPending/:id", async (req, res) => {

      let upId = req.params.id
      // console.log(upId)
      let filter = { _id: new ObjectId(upId) }
      let ApprovedParcel = {
        $set: {
          status: "Pending"
        },
      };
      let result = await StandardDelivery.updateOne(filter, ApprovedParcel)
      res.send(result)

    })


    // Admin All Parcel Find.. Amount change parcel
    // _______________________________________________________________________________
    app.get("/AdminAllStandardDeliveryDataFindAmountChange", async (req, res) => {
      let result = await StandardDelivery.find().toArray()
      res.send(result)
    })


    // Admin Amount Change Data Verified
    // _______________________________________________________________________________
    app.patch("/AdminAmountChangeDataVerified/:id", async (req, res) => {

      let upId = req.params.id
      // console.log(upId)
      let filter = { _id: new ObjectId(upId) }
      let ApprovedParcel = {
        $set: {
          AmountChangeAdminStatus: "verified"
        },
      };
      let result = await StandardDelivery.updateOne(filter, ApprovedParcel)
      res.send(result)

    })

    // Admin Email Search user all amount change data find
    // _______________________________________________________________________________
    app.get("/AdminAmountChangeUserDataFindEmailGet", async (req, res) => {

      // console.log(req.query?.email)
      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })

    // Admin All View Payment Request Data Find
    // _______________________________________________________________________________
    app.get("/AdminAllPaymentRequestData", async (req, res) => {
      let result = await UserPaymentRequestCollection.find().toArray()
      res.send(result)
    })

    // Admin Paid all User Payment Request Data
    // _______________________________________________________________________________
    app.patch("/AdminPaidUserPaymentRequestData/:id", async (req, res) => {

      let upId = req.params.id
      // console.log(upId)
      let filter = { _id: new ObjectId(upId) }
      let ApprovedParcel = {
        $set: {
          Payment: "Paid"
        },
      };
      let result = await UserPaymentRequestCollection.updateOne(filter, ApprovedParcel)
      res.send(result)

    })

    // Admin user Payment Request All Data Find
    // _______________________________________________________________________________

    app.get("/AdminPaymentRequestAllDataFind", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { ReqUserEmail: req.query.email }
      }
      let result = await UserPaymentRequestCollection.find(query).toArray()
      res.send(result)

    })

    // Admin User Payment Request Unik Data find
    // _______________________________________________________________________________

    app.get("/AdminPaymentDetailsUnikeDatFind/:id", async (req, res) => {
      let id = req.params.id
      // console.log(id)
      let query = { _id: new ObjectId(id) }
      let result = await UserPaymentRequestCollection.findOne(query)
      res.send(result)
    })


    // Admin Payment request send, user email find all standard delivery data
    // _______________________________________________________________________________

    app.get("/AdminPaymentRequestSendUserEmailFindAllDeliveryData", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { StandardEmailUser: req.query.email }
      }
      let result = await StandardDelivery.find(query).toArray()
      res.send(result)

    })

    // Admin Payment request send, user Information get user Collection
    // _______________________________________________________________________________

    app.get("/AdminPaymentRequestSendUserInformationGet", async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      let result = await userCollection.find(query).toArray()
      res.send(result)

    })


    // Admin Coverage District All District find
    // _______________________________________________________________________________
    app.get("/CoveragesDistrictsAll", async (req, res) => {
      let result = await CoverageAllDistrictCollection.find().toArray()
      res.send(result)
    })

    // Admin Coverage District Add Police Station __________________________

    app.post("/AdminAddPoliceStationCoverage", async (req, res) => {
      let PoliceStationData = req.body

      let query = { AddPoliceStation: PoliceStationData.AddPoliceStation }
      let existingUser = await CoverageAllPoliceStation.findOne(query)
      if (existingUser) {
        return res.send({ message: "Already Add Police Station This District" })
      }
      let result = await CoverageAllPoliceStation.insertOne(PoliceStationData)
      res.send(result)
    })

    // Admin Coverage Police Station All Police Station find
    // _______________________________________________________________________________
    app.get("/CoveragesPoliceStationAll", async (req, res) => {
      let result = await CoverageAllPoliceStation.find().toArray()
      res.send(result)
    })

    // Delete Police Station of Hub
    // ==================================
    app.delete('/DeletedPoliceStationWithOfCoverage/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) }
        const result = await CoverageAllPoliceStation.deleteOne(query);
        res.send(result);
    });


    // Admin Coverage Police Station Hub Add And Update  { will-delete}
    // ===================================================================

    // app.put("/AdminAddHubAndUpdateHub/:policeStation", async (req, res) => {

    //   let PoliceStation = req.params.policeStation
    //   let upData = req.body
    //   let filter = { AddPoliceStation: PoliceStation }
    //   let options = { upsert: true }
    //   let AddHUbAndUpdate = {
    //     $set: {
    //       MyHub: upData.MyHub
    //     },
    //   };
    //   let result = await CoverageAllPoliceStation.updateOne(filter, AddHUbAndUpdate, options)
    //   res.send(result)

    // })


    // // Admin All My Pickup Request Data Find
    // // _______________________________________________________________________________xx{ will-delete}
    // app.get("/AdminAllPickupData", async (req, res) => {
    //   let result = await UserPickupRequestCollection.find().toArray()
    //   res.send(result)
    // })

    // // Admin My Pickup Request Data Approved
    // // _______________________________________________________________________________xx{ will-delete}
    // app.put("/AdminApprovedUserPickupRequestData/:id", async (req, res) => {
    //   let upId = req.params.id
    //   let upData = req.body
    //   let filter = { _id: new ObjectId(upId) }
    //   let options = { upsert: true }
    //   let ApprovedParcel = {
    //     $set: {
    //       status: "Approved",
    //       parcelNum: upData.parcelNum
    //     },
    //   };
    //   let result = await UserPickupRequestCollection.updateOne(filter, ApprovedParcel, options)
    //   res.send(result)

    // })
    // // Admin user PickUp Request All Data Find 
    // // _______________________________________________________________________________{ will-delete}
    // app.get("/AdminPickupRequestAllDataFindUser", async (req, res) => {
    //   let query = {}
    //   if (req.query?.email) {
    //     query = { PickReqUserEmail: req.query.email }
    //   }
    //   let result = await UserPickupRequestCollection.find(query).toArray()
    //   res.send(result)

    // })
    // // User Pickup Request Send. Post Pickup Request Data
    // // ===================================================================xx{ will-delete}
    // app.post("/UserPickupRequestSend", async (req, res) => {
    //   let Standard = req.body
    //   let result = await UserPickupRequestCollection.insertOne(Standard)
    //   res.send(result)
    // })
    // // user All Pickup Request Data find  _________________________________________{ will-delete}
    // app.get("/UseAllPickupRequestDataGetAll", async (req, res) => {
    //   let query = {}
    //   if (req.query?.email) {
    //     query = { PickReqUserEmail: req.query.email }
    //   }
    //   let result = await UserPickupRequestCollection.find(query).toArray()
    //   res.send(result)
    // })



    // =========================================================================================
    // Admin All Parcel Standard Delivery invoice temporory
    // =========================================================================================

    app.get("/AdminStandardDeliveryDataTemporory", async (req, res) => {
      let query = {}
      if (req.query?.StandardParcelId) {
        query = { StandardParcelId: req.query.StandardParcelId }
      }
      let result = await StandardDelivery.findOne(query)
      res.send(result)
    })

















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {

  res.send("Ecommerse Server is running")
})

app.listen(port, () => {
  console.log(`Client project server is running ${port}`)
})


