import React, { useEffect, useState } from "react";
import http from "../http.service";
import { ApiURL } from "../api-config";

export default function Tier() {
	const options = {
		headers: { "x-api-key": ApiURL.tierApiKey }
	};

	const [bikes, setBikes] = useState([]);

	useEffect(() => {
		const tempBikes = onLoad();
		setBikes(tempBikes);
	}, []);

	const onLoad = async () => {
		return await getTier().data;
	};

	async function getTier() {
		console.log("ey");
		return await http
			.get(ApiURL.tier, {
				headers: {
                    "x-api-key": ApiURL.tierApiKey,
                    'Content-Type': 'application/json',
				},
				
			})
			.then(res => {
				console.log(res.data);
				setBikes(res.data);
			});

		console.log("ney");
	}

	return (
		<>
			<h1>Tier works!</h1>
		</>
	);
}
