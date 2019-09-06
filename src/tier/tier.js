import React, { createContext } from "react";
import http from "../http.service";
import { useLocalStore } from "mobx-react-lite";
import { ApiURL } from "../api-config";

export const tierContext = createContext();
export const TierProvider = ({ children }) => {
	const store = useLocalStore(() => ({
		/* observables */
		tiers: [],
		tier: {},
		isLoading: false,
		error: "",

		/* actions */
		async getTiers() {
			store.isLoading = true;

			try {
				store.tiers = (await http.get(ApiURL.tier, {
					headers: {
						"x-api-key": ApiURL.tierApiKey
					}
				})).data;

				console.log(store.tiers);
			} catch (e) {
				alert(e.message);
			}

			store.isLoading = false;
		}
	}));

	return (
		<tierContext.Provider value={store}>{children}</tierContext.Provider>
	);
};
