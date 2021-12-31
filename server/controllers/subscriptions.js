const Subscription = require("../models/subscriptions");
const HttpError = require("../models/httpError");

const createSubscription = async (req, res, next) => {
    const { endpoint, keys } = req.body;

    const createdSubscription = new Subscription({ endpoint, keys });

    try {
        await createdSubscription.save();
    } catch (err) {
        const error = new HttpError("Creating subscription failed, please try again.", 500);
        return next(error);
    }

    res.status(201).json({ subscription: createdSubscription.toObject({ getters: true }) });
};

module.exports = { createSubscription };
