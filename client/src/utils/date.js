

export const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();

    const d = date.toISOString().split("T")[0];
    const t = today.toISOString().split("T")[0];

    if (d === t) return "Today";

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const y = yesterday.toISOString().split("T")[0];

    if (d === y) return "Yesterday";

    return d;
};