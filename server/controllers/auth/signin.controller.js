import "dotenv/config";

import { turso } from "../../config/turso.js";
import { comparePassword } from "../../utils/auth.utils.js";
import { generateTokens, storeRefreshToken } from "../../utils/token.utils.js";

const signinController = async (req, res) => {
    try {
        let { username, password, userRole } = req.body;
        userRole = userRole.toLowerCase();

        const tableMap = {
            student: "students",
            teacher: "teachers",
            parent: "parents",
            admin: "admins"
        };

        const table = tableMap[userRole];

        if (!table) {
            return res.status(400).json({
                success: false,
                error: "Invalid user role"
            });
        }

        let existUser = null

        if(table === "teachers") {
            existUser = await turso.execute(
               `SELECT t.*, c.course as in_charge_course, c.year as in_charge_year FROM ${table} t LEFT JOIN classes c ON c.in_charge = t.teacherId WHERE ${table.slice(0, -1)}Id = ? `,
               [username] 
           );
           
        }else{
            
            existUser = await turso.execute(
               `SELECT * FROM ${table} t WHERE ${table.slice(0, -1)}Id = ?`,
               [username] 
           );
        }

        console.log(existUser);
        
        if (!existUser.rows.length) {
            return res.status(400).json({
                success: false,
                error: "Invalid username or password"
            });
        }

        let user = existUser.rows[0];

        const validPassword = await comparePassword(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                error: "Invalid username or password"
            });
        }

        const idKey = {
            student: "studentId",
            teacher: "teacherId",
            parent: "parentId",
            admin: "adminId"
        }[userRole];

        delete user.password;
        user.userId = user[idKey];
        user.role = userRole;

        const tokens = generateTokens(user.userId, user.role);
        await storeRefreshToken(user.userId, tokens.refreshToken);
        
        

        res.json({
            success: true,
            ...tokens,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

export default signinController;
