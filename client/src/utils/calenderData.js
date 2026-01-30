const dateString = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const calendarData = (year, month) => {

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

        const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => ({
            day: null,
            status: "empty",
            date: `empty-${i}`,
        }));

        const monthDays = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            status: "na",
            date: dateString(new Date(year, month, i + 1)),
        }));

        return [...emptyDays, ...monthDays];
    };