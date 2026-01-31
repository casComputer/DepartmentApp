import { Linking } from "react-native";

export const openPhone = number => {
    Linking.openURL(`tel:${number}`);
};

export const openWhatsApp = (number, message = "") => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
};

export const openEmail = (email, subject = "", body = "") => {
    const url = `mailto:${email}?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url);
};
