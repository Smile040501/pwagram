const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const subscriptionsRoutes = require("./routes/subscriptions");
const HttpError = require("./models/httpError");

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
    );
    next();
});

app.use("/posts", postsRoutes);
app.use("/subscriptions", subscriptionsRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {});
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

(async () => {
    try {
        await mongoose.connect(
            // Confirm URI at MongoDB Atlas Project Cluster
            `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rfhfl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            }
        );
        const port = process.env.PORT || 8000;
        app.listen(port, () => {
            console.log("Server running!");
        });
    } catch (err) {
        console.log(err);
    }
})();
