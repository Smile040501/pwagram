const express = require("express");

const subscriptionsController = require("../controllers/subscriptions");

const router = express.Router();

router.post("/", subscriptionsController.createSubscription);

module.exports = router;
