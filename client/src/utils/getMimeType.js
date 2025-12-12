
const getMimeType = (format) => {
  if (!format) return "application/octet-stream";

  if (format === "pdf") return "application/pdf";

  // Common image formats
  const imageTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
  };

  if (imageTypes[format]) {
    return imageTypes[format];
  }

  // fallback for unknown formats
  return `application/${format}`;
};

export default getMimeType  