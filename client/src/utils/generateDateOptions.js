const generateDateOptions = (limit=3) => {
    const dates = [];
    let today = new Date();

    for (let i = 0; i < limit; i++) {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const date = String(today.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${date}`;
        const formatted_string = today.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "2-digit"
        });

        dates.push({
            id: formattedDate,
            title: i === 0 ? "today" : i === 1 ? "yesterday" : formatted_string
        });


        today = new Date(today.setDate(today.getDate() - 1));
    }

    return dates
};

export default generateDateOptions;
