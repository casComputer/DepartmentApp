import cloudinary from "../config/cloudinary.js";
import { tursoStats as tursoStatsClient, turso } from "../config/turso.js";

export const cloudinaryStats = async (req, res) => {
    try {
        const usage = await cloudinary.api.usage();

        res.json({
            success: true,
            usage
        });
    } catch (error) {
        console.error("Error while fetching cloudinary stats: ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!",
            error: error?.message ?? "Error while fetching cloudinary stats!"
        });
    }
};

export const tursoStats = async () => {
    async (req, res) => {
        try {
            const usageStatsWithDate =
                await tursoStatsClient.databases.usage("database");

            res.json({
                success: true,
                stats: usageStatsWithDate
            });
        } catch (error) {
            console.error("Error while fetching turso stats: ", error);
            res.json({
                success: false,
                message: "Failed to fetch turso status!",
                error: error?.message ?? "Failed to fetch turso status"
            });
        }
    };
};

export const usersStats = async (req, res) => {
    try {
        const { rows } = await turso.execute(` 
            SELECT COUNT(userId) as strength, role FROM users GROUP BY role;
        `);

        const users = {};

        rows.forEach(user => {
            users[user.role] = {
                strength: user.strength
            };
        });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

        console.error(error);
    }
};
