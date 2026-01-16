export const formatDate = timestamp => {
    let date;

    // Handle epoch milliseconds (number or numeric string)
    if (
        typeof timestamp === "number" ||
        (typeof timestamp === "string" && /^\d+(\.\d+)?$/.test(timestamp))
    ) {
        date = new Date(Number(timestamp));
    }
    // Handle ISO date strings
    else {
        date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return "Invalid date";

    // Get LOCAL yyyy-mm-dd
    const getLocalDate = d =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
            2,
            "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;

    const d = getLocalDate(date);

    const today = new Date();
    const t = getLocalDate(today);

    if (d === t) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const y = getLocalDate(yesterday);

    if (d === y) return "Yesterday";

    return d;
};

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

export const getRemainingDays = (dueDate) => {
  if (!dueDate) return null;

  const today = new Date();
  const due = new Date(dueDate);

  // Remove time part to avoid partial-day issues
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};