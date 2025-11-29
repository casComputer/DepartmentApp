import { HOURS_PER_DAY } from "../constants/constants.js";

export const getWorkingHoursThisMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const hoursPerDay = HOURS_PER_DAY;

    const lastDay = new Date(year, month + 1, 0).getDate();

    let workingDays = 0;

    for (let day = 1; day <= lastDay; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            workingDays++;
        }
    }

    const totalHours = workingDays * hoursPerDay;

    return { workingDays, totalHours };
};

export const getYYYYMMDD =()=> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // YYYY-MM-DD
}

