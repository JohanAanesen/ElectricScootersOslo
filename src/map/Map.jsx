import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import { useObserver } from "mobx-react-lite";
import Axios from "axios";
import { ApiURL } from "../api-config";

export default function Map() {
	const [tier, setTier] = useState([]);
	const [circ, setCirc] = useState([]);
	const [voi, setVoi] = useState([]);

	useEffect(() => {
		loadTiers();
		loadCircs();
		loadVois();
	}, []);

	const loadTiers = async () => {
		return await getTiers();
	};

	const loadCircs = async () => {
		return await getCircs();
	};

	const loadVois = async () => {
		return await getVois();
	};

	async function getTiers() {
		try {
			const tempTiers = (await Axios.get(ApiURL.tier, {
				headers: {
					"x-api-key": ApiURL.tierApiKey
				}
			})).data;

			console.log(tempTiers);
			setTier(tempTiers.data);
		} catch (e) {
			alert(e.message);
		}
	}

	async function getCircs() {
		try {
			const tempCirc = (await Axios.get(ApiURL.circ)).data;

			console.log(tempCirc.Data.Scooters);
			setCirc(tempCirc.Data.Scooters);
		} catch (e) {
			alert(e.message);
		}
	}

	async function getVois() {
		try {
			const tempVoi = (await Axios.get(ApiURL.voi)).data;

			console.log(tempVoi);
			setCirc(tempVoi);
		} catch (e) {
			alert(e.message);
		}
	}

	const addTierMarkers = links => map => {
		links.forEach(ti => {
			const marker = new window.google.maps.Marker({
				map,
				icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
				position: { lat: ti.lat, lng: ti.lng },
				title: ti.id
			});
		});
	};

	const addCircMarkers = links => map => {
		links.forEach(ti => {
			const marker = new window.google.maps.Marker({
				map,
				position: {
					lat: ti.location.latitude,
					lng: ti.location.longitude
				},
				title: ti.ScooterCode
			});
		});
	};

	const addVoiMarkers = links => map => {
		links.forEach(ti => {
			const marker = new window.google.maps.Marker({
				map,
				position: {
					lat: ti.location[0],
					lng: ti.location[1]
				},
				title: ti.id
			});
		});
	};

	const mapProps = {
		options: {
			center: { lat: 59.925733, lng: 10.757766 },
			zoom: 13
		},
		onMount: addCircMarkers(circ)
	};

	const mapProps2 = {
		options: {
			center: { lat: 59.925733, lng: 10.757766 },
			zoom: 13
		},
		onMount: addTierMarkers(tier)
	};

	const mapProps3 = {
		options: {
			center: { lat: 59.925733, lng: 10.757766 },
			zoom: 13
		},
		onMount: addVoiMarkers(voi)
	};

	return useObserver(() => (
		<>
			<h1>Tier and Circ el-scooters in Oslo:</h1>
			<MapComponent {...mapProps}></MapComponent>
			<MapComponent {...mapProps2}></MapComponent>
			<MapComponent {...mapProps3}></MapComponent>
		</>
	));
}
