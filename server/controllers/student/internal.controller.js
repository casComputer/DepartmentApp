import Internal from "../../models/internalMark.js";

export const getInternalMarks = async (req, res) => {
    try {
        const { course, limit = 10, page = 1 } = req.body;

        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const skip = (parsedPage - 1) * parsedLimit;

        // Get paginated + sorted data
        const internals = await Internal.find({ course })
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(parsedLimit);

        // Get total count (needed to know if next page exists)
        const totalCount = await Internal.countDocuments({ course });

        const hasNextPage = parsedPage * parsedLimit < totalCount;

        res.json({
            success: true,
            internals,
            nextPage: hasNextPage ? parsedPage + 1 : null
        });
    } catch (e) {
        console.log("Error while fetching internal marks: ", e);
        res.json({
            success: false,
            message: "Internal Server Error!"
        });
    }
};
