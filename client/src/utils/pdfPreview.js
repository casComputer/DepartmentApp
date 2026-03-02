const getPreviewUrl = url => {
    if (!url) return "";

    if (url.endsWith(".pdf")) {
        const normalized = url
            .replace("/raw/upload/", "/image/upload/")
            .replace(/\/image\/upload\/(.*?\/)?/, "/image/upload/"); // strip existing transforms

        return normalized.replace("/image/upload/", "/image/upload/pg_1,f_jpg,w_600,q_auto/");
    }

    return url;
};

export default getPreviewUrl