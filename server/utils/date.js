export const isDatePassed = input => {
    if (!input) return null;
    let date;

    if (input instanceof Date) date = input;
    else if (typeof input === "number")
        date = new Date(input.toString().length === 10 ? input * 1000 : input);
    else if (typeof input === "string") date = new Date(input);

    if (!date || isNaN(date.getTime())) return null;

    return date.getTime() < Date.now();
};