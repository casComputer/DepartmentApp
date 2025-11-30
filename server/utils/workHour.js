import { HOURS_PER_DAY } from "../constants/constants.js";

const getTodaySchedule = (date = new Date()) => {
    const isFriday = date.getDay() === 5;

    if (!isFriday) {
        // Monday – Thursday
        return [
            { start: "09:30", end: "10:30" },
            { start: "10:30", end: "11:25" },
            { start: "11:35", end: "12:30" },
            { start: "13:30", end: "14:30" },
            { start: "14:30", end: "15:30" }
        ];
    }

    // Friday schedule
    return [
        { start: "09:30", end: "10:30" },
        { start: "10:30", end: "11:25" },
        { start: "11:35", end: "12:30" },
        { start: "14:00", end: "15:00" },
        { start: "15:00", end: "16:00" }
    ];
};

const toDateTime = (baseDate, timeStr) => {
    const [h, m] = timeStr.split(":").map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
};

export const getRemainingHoursToday = () => {
    const now = new Date();
    const day = now.getDay();

    if (day === 0 || day === 6) {
        return {
            remainingHoursToday: 0,
            currentSlot: null
        };
    }

    const schedule = getTodaySchedule(now);
    let remainingMinutes = 0;
    let currentSlot = null;

    for (const slot of schedule) {
        const start = toDateTime(now, slot.start);
        const end = toDateTime(now, slot.end);

        if (now >= start && now <= end) {
            // inside a slot → add remaining part
            currentSlot = slot;
            remainingMinutes += (end - now) / 1000 / 60;
        } else if (now < start) {
            // future slot → add full slot
            remainingMinutes += (end - start) / 1000 / 60;
        }
    }

    return {
        remainingHoursToday: Number((remainingMinutes / 60).toFixed(2)),
        currentSlot
    };
};

export const getRemainingWorkingHoursThisMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const lastDay = new Date(year, month + 1, 0).getDate();
    let remainingDays = 0;

    for (let d = now.getDate(); d <= lastDay; d++) {
        const date = new Date(year, month, d);
        const dow = date.getDay();

        if (dow !== 0 && dow !== 6) {
            remainingDays++;
        }
    }

    const remainingHours = remainingDays * 5;

    return {
        remainingDays,
        remainingHours
    };
};

export const getRemainingWorkSummary = () => {
    return {
        ...getRemainingHoursToday(),
        ...getRemainingWorkingHoursThisMonth()
    };
};

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

export const getYYYYMMDD = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // YYYY-MM-DD
};

export const getFirstAndLastDate = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const first = `${year}-${month}-01`;
    const last = `${year}-${month}-31`;

    return { first, last };
};

console.log(getFirstDayOfMonth());
