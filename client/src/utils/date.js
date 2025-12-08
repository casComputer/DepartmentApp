

export const formatDate = timestamp => {
    const date = new Date(timestamp);

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
