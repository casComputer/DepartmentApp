import jwt from "jsonwebtoken";


export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			console.log("\n\n==============");
			console.log("invalid access token encountered!");
			console.log("env: ", process.env.JWT_ACCESS_TOKEN_SECRET);
			return res.sendStatus(403);
		}
		req.user = user;
		next();
	});
};
    
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: "Forbidden",
            });
        }

        next();
    };
};