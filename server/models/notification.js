import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        body: String,

        data: String,


        target: [
            {
                type: String,
                enum: ["all", "teacher", "student", "parent", "admin", "class"],
                required: true
            }
        ],
        
        yearCourse: String, // is taget is class

        userIds: [
            {
                type: String
            }
        ],

        reads: [
            {
                type: String
            }
        ],

        createdAt: {
            type: Date,
            default: Date.now
        },

        // Auto-delete after 2 weeks
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        }
    },
    {
        versionKey: false
    }
);

// TTL index → auto delete after expiresAt
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Query performance indexes
NotificationSchema.index({ target: 1 });
NotificationSchema.index({ userIds: 1 });
NotificationSchema.index({ reads: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model("notification", NotificationSchema);
