// usageUtils.js

// ---------- Number formatters ----------
export const formatNumber = (value) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    return value.toString();
};

export const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

// ---------- Progress calculator ----------
export const getProgress = (used, total) => {
    if (!total || total === 0) return 0;
    return Math.min(used / total, 1);
};

