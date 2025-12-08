const getPdfPreviewUrl = (pdfUrl) => {
  return pdfUrl
    .replace("/upload/", "/upload/pg_1,f_jpg/g_center/");
};

export default getPdfPreviewUrl