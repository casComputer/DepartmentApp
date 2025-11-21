import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const hashPassword = async password => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
};

export const validateSignupFields = data => {
    const { username, password, fullName, userRole, course, year } = data;

    if (!username || !password || !fullName || !userRole) {
        throw new Error("All fields are required");
    }

    if (!["student", "teacher", "parent"].includes(userRole)) {
        throw new Error("Invalid role");
    }

    if (userRole === "student") {
        if (!["Bca", "Bsc"].includes(course)) {
            throw new Error("Course is required for students");
        }
        if (!["First", "Second", "Third", "Fourth"].includes(year)) {
            throw new Error("Invalid year of study");
        }
    }
};

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
