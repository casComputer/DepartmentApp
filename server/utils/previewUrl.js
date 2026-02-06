const getPreviewUrl = (url, type) => {
    if (!url) return "";
    if (!url.endsWith(".pdf")) return url; // fallback (icons, etc.)

    if (type === "raw") {
        if (url.endsWith(".pdf")) {
            return url.replace(
                "/image/upload/",
                "/image/upload/pg_1,f_jpg,w_600,q_auto/"
            );
        }
    }
    if (url.endsWith(".pdf")) {
        return url
            .replace("/raw/upload/", "/image/upload/")
            .replace(
                "/image/upload/",
                "/image/upload/pg_1,f_jpg,w_600,q_auto/"
            );
    }
};

export default getPreviewUrl;
