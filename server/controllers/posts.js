const webpush = require("web-push");
const normalize = require("normalize-path");

const Post = require("../models/posts");
const Subscription = require("../models/subscriptions");
const HttpError = require("../models/httpError");

webpush.setVapidDetails(
    "mailto:example@domain.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const getPosts = async (req, res, next) => {
    let posts;
    try {
        posts = await Post.find({});
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find posts.", 500);
        return next(error);
    }

    if (!posts) {
        const error = new HttpError("Could not find posts.", 404);
        return next(error);
    }

    posts.sort((p1, p2) => new Date(p1.createdAt) - new Date(p2.createdAt));

    res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

const getPostById = async (req, res, next) => {
    const postId = req.params.pId;

    let post;
    try {
        post = await Post.findById(postId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not find post.", 500);
        return next(error);
    }

    if (!post) {
        const error = new HttpError("Could not find post.", 404);
        return next(error);
    }

    res.json({ post: post.toObject({ getters: true }) });
};

const createPost = async (req, res, next) => {
    const { title, location, rawLocationLat, rawLocationLng } = req.body;

    const createdPost = new Post({
        title,
        location,
        image: normalize(req.file.path),
        rawLocation: { lat: rawLocationLat, lng: rawLocationLng },
    });

    let subscriptions;
    try {
        await createdPost.save();
        subscriptions = await Subscription.find({});
    } catch (err) {
        const error = new HttpError("Creating post failed, please try again.", 500);
        return next(error);
    }

    if (!subscriptions) {
        const error = new HttpError("Could not find subscriptions.", 404);
        return next(error);
    }

    try {
        await Promise.all(
            subscriptions.map(async (sub) => {
                const pushConfig = {
                    endpoint: sub.endpoint,
                    keys: {
                        auth: sub.keys.auth,
                        p256dh: sub.keys.p256dh,
                    },
                };
                await webpush.sendNotification(
                    pushConfig,
                    JSON.stringify({
                        title: "New Post!",
                        content: "New Post added!",
                        openUrl: "/help",
                    })
                );
            })
        );
    } catch (err) {
        const error = new HttpError("Failed to send the notification.", 500);
        return next(error);
    }

    res.status(201).json({ post: createdPost.toObject({ getters: true }) });
};

module.exports = { getPosts, getPostById, createPost };
