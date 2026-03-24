import Notice from "../../models/notice.js";

export const getUserNotices = async (req, res) => {
    try {
        const { page = 1, limit = 15, course = "", year = "" } = req.body;
        const { role } = req.user;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const query = {
            $or: [{ target: "all" }, { target: role }]
        };

        // Students and parents can also see class-specific notices
        if ((role === "student" || role === "parent") && course && year) {
            query.$or.push({
                target: "class",
                yearCourse: `${year}-${course}`
            });
        }

        const notices = await Notice.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .lean();

        const hasMore = notices.length === limitNum;

        res.json({
            success: true,
            notices,
            hasMore,
            nextPage: hasMore ? pageNum + 1 : null
        });
    } catch (error) {
        console.error("Error fetching user notices:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
