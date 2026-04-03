import cron from "node-cron";

import { runFeeCheck } from "../controllers/worker/fee.js";
import { runDeadlineCheck } from "../controllers/worker/assignment.js";

export const startDeadlineWorker = () => {
    // Runs every day at 6:00 AM
    cron.schedule(
        "0 6 * * *",
        async () => {
            await runDeadlineCheck();
            await runFeeCheck();
        },
        {
            timezone: "Asia/Kolkata"
        }
    );
};
