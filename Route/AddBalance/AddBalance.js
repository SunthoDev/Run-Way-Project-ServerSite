const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (AddBalanceRequestUserCollection) => {
    let router = express.Router()


    router.get("/", async (req, res) => {
        const result = await AddBalanceRequestUserCollection.find().toArray();
        res.send(result)
    })
    router.post('/', async (req, res) => {
        const Balance = req.body;
        const result = await AddBalanceRequestUserCollection.insertOne(Balance);
        res.send(result);
    });


    return router;
}