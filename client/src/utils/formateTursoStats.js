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

export const formatUsage = (usageData) => {
    if (!usageData || typeof usageData !== "object") {
        throw new Error("Invalid usage data: expected an object.");
    }

    // Validate nested objects
    const objectsUsage = usageData.objects?.usage ?? 0;
    const requestsUsage = usageData.requests ?? 0;
    const storageUsage = usageData.storage?.usage ?? 0;

    // Validate limits or fallback to defaults
    const maxReads = usageData.derived_resources ?? 500_000_000;
    const maxWrites = usageData.requests ?? 10_000_000;
    const maxStorage = usageData.storage?.limit_bytes ?? 5 * 1024 ** 3; // 5 GB fallback

    // Ensure numbers are valid
    const safeNumber = (num, fallback = 0) =>
        typeof num === "number" && !isNaN(num) ? num : fallback;

    return {
        reads: {
            text: `${formatNumber(safeNumber(objectsUsage))} / ${formatNumber(maxReads)}`,
            progress: getProgress(safeNumber(objectsUsage), maxReads),
        },
        writes: {
            text: `${formatNumber(safeNumber(requestsUsage))} / ${formatNumber(maxWrites)}`,
            progress: getProgress(safeNumber(requestsUsage), maxWrites),
        },
        storage: {
            text: `${formatBytes(safeNumber(storageUsage))} / ${formatBytes(maxStorage)}`,
            progress: getProgress(safeNumber(storageUsage), maxStorage),
        },
    };
};
