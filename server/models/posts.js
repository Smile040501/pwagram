const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title: { type: String, required: true },
        location: { type: String, required: true },
        image: { type: String, required: true },
        rawLocation: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
