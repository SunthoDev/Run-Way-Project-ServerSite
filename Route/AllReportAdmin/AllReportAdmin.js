const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = ({StandardDelivery,UserPickupRequestCollection,ReturnParcelCollection,DispatchParcelCollection,AddBalanceRequestUserCollection,UserPaymentRequestCollection}) => {
    let router = express.Router()

    // All user (Parcel) data find here
    // ==============================================
    router.get("/AllUserParcelData", async (req, res) => {
        let result = await StandardDelivery.find().toArray()
        res.send(result)
    })
    // All user (Pickup Request) data find here
    // ==============================================
    router.get("/AllUserPickupRequestData", async (req, res) => {
        let result = await UserPickupRequestCollection.find().toArray()
        res.send(result)
    })
    // All user (Return Parcel) data find here
    // ==============================================
    router.get("/AllUserReturnParcelData", async (req, res) => {
        let result = await ReturnParcelCollection.find().toArray()
        res.send(result)
    })
    // All (Dispatch Parcel) data find here
    // ==============================================
    router.get("/AllDispatchRequestData", async (req, res) => {
        let result = await DispatchParcelCollection.find().toArray()
        res.send(result)
    })
    // All (Add Balance Request) data find here
    // ==============================================
    router.get("/AllAddBalanceRequestData", async (req, res) => {
        let result = await AddBalanceRequestUserCollection.find().toArray()
        res.send(result)
    })
    // All (User Payment Request) data find here
    // ==============================================
    router.get("/AllPaymentRequestDataOfParcel", async (req, res) => {
        let result = await UserPaymentRequestCollection.find().toArray()
        res.send(result)
    })









    return router;
}