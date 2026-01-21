const getPdfPreviewUrl = (pdfUrl) => {
    return pdfUrl.replace("/upload/", "/upload/pg_1,f_jpg,w_600,q_auto/");
};

export default getPdfPreviewUrl;
