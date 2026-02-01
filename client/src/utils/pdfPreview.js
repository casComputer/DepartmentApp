const getPreviewUrl = url => {
    if (!url) return "";

    if (url.endsWith(".pdf")) {
        return url
            .replace("/raw/upload/", "/image/upload/")
            .replace(
                "/image/upload/",
                "/image/upload/pg_1,f_jpg,w_600,q_auto/"
            );
    }

    return url; // fallback (icons, etc.)
};

export default getPreviewUrl;
