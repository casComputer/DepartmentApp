import Notes from "../../models/notes.js";

export const fetchByStudent = async (req, res) => {
    try {
        const { course, year, parentId, page = 1, limit = 20 } = req.body;

        if (!course || !year)
            return res.json({
                success: false,
                message: "course and year is required!"
            });

        const skip = (page - 1) * limit;

        // Get total count for hasMore calculation
        const totalCount = await Notes.countDocuments({
            parentId,
            course,
            year
        });

        const notes = await Notes.find({
            parentId,
            course,
            year
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Add sorting for consistent pagination

        const hasMore = skip + notes.length < totalCount;

        res.json({
            notes,
            success: true,
            hasMore,
            nextPage: hasMore ? page + 1 : null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};
