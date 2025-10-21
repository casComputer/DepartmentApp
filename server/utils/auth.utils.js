import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Generate access and refresh tokens
export const generateTokens = (username, role) => {
    const payload = { username, role };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "1m"
    });
    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d"
        }
    );
    return { accessToken, refreshToken };
};

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
