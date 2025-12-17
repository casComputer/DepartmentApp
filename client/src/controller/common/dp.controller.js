import axios from "@utils/axios.js";

import { useAppStore } from "@store/app.store.js";

export const upload = async data => {
    const user = useAppStore.getState().user;
    const { userId, role } = user;

    if (!userId || !role) return;

    try {
        const res = await axios.post("/profile/uplaodDp", {
            userId,
            role,
            ...data
        });
        
        
        console.log(res.data);
    } catch (error) {
        console.error(error);
    }
};
