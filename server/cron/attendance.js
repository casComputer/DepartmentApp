import { Worker } from 'worker_threads'
import cron from 'node-cron';


// 6:00 AM daily
cron.schedule("* 6 * * *", () => {
	console.log("Running daily job at 6 AM");
	new Worker("./workers/monthlyAttendance.js");
});

// 5:00 PM daily
cron.schedule("0 17 * * *", () => {
	console.log("Running daily job at 5 PM");
});

export default 5
