import "dotenv/config";
import mongoose from "mongoose";

(async () => {
    try {
        const MONGODB_PASSWORD =
            process.env.MONGODB_PASSWORD ;
        
        const uri = `mongodb+srv://casdepartmentcomputer:${MONGODB_PASSWORD}@db-primary.rqbfcnl.mongodb.net/?appName=db-primary`;
        const conn = await mongoose.connect(uri);
        console.log("connected to mongodb atlas🍂");
    } catch (error) {
        console.error(error);
    }
})();
