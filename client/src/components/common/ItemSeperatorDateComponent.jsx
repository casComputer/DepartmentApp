import { Text } from "react-native";

import { formatDate } from "@utils/date.js";

export const ItemSeparator = ({ trailingItem, leadingItem }) => {
    let leadingDate = null,
        trailingDate = null;

    if (leadingItem.timestamp && trailingItem.timestamp) {
        leadingDate = formatDate(leadingItem.timestamp);
        trailingDate = formatDate(trailingItem.timestamp);
    } else if (leadingItem.date && trailingItem.date) {
        leadingDate = formatDate(leadingItem.date);
        trailingDate = formatDate(trailingItem.date);
    } else if (leadingItem.createdAt && trailingItem.createdAt) {
        leadingDate = formatDate(leadingItem.createdAt);
        trailingDate = formatDate(trailingItem.createdAt);
    }

    if (!leadingDate || !trailingDate) return null;

    if (leadingDate === trailingDate) return null;

    return (
        <Text className="my-1 text-xl font-bold px-2 text-text/80">
            {trailingDate}
        </Text>
    );
};

export const ListHeaderComponent = ({ date }) => {
    if (!date) return null;

    const fdate = formatDate(date);

    if (!fdate) return null;

    return (
        <Text className="my-1 text-xl font-bold px-2 text-text/80">
            {fdate}
        </Text>
    );
};
