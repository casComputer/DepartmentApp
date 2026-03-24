import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        image: {
            type: String // cloudinary secure_url
        },

        imagePublicId: {
            type: String // for deletion
        },

        target: {
            type: String,
            enum: ["all", "teacher", "student", "parent", "class"],
            required: true
        },

        yearCourse: {
            type: String // required when target === "class"
        },

        createdBy: {
            type: String,
            required: true // admin userId
        },

        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Auto-delete after expiresAt
NoticeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

NoticeSchema.index({ target: 1 });
NoticeSchema.index({ yearCourse: 1 });
NoticeSchema.index({ createdAt: -1 });

export default mongoose.model("notice", NoticeSchema);
