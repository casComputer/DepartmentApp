import Notes from "../../models/notes.js";


export const fetchByStudent = async (req, res) => {
    try {
        const { course, year, parentId } = req.body;

        if (!course || !year)
            return res.json({
                success: false,
                message: "course and year is required!"
            });

        const notes = await Notes.find({
            parentId,
            course,
            year
        });

        res.json({ notes, success: true });
    } catch (error) {
        console.error(error);
        res.send(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
}