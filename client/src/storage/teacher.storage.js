import { storage } from "@utils/storage.js";

export const updateInCharge = (data) => {
	storage.set("in_charge", JSON.stringify(data ?? {}));

	console.log("from storage: ", storage.getString("in_charge"));
};
