
import { FOLDER_COLORS } from '@constants/colors.js'

export const getColorFromString = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return FOLDER_COLORS[Math.abs(hash) % FOLDER_COLORS.length];
};
