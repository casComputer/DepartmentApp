import mongoose from "mongoose";

export const checkHealth = async (req, res) => {
    const health = {
        uptime: process.uptime(),
        timestamp: Date.now(),
        status: "OK",
        services: {
            mongodb: "checking",
            turso: "checking",
            cloudinary: "checking"
        }
    };

    try {
        await mongoose.connection.db.admin().ping();
        health.services.mongodb = "OK";
    } catch (err) {
        health.services.mongodb = "ERROR";
        health.status = "DEGRADED";
    }

    res.json(health);
};

export const isServerRunning = async (req, res) => {
    res.status(200).send("server is alive 🍂");
};
