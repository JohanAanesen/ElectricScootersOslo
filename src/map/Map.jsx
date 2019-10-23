import React, { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import { useObserver } from "mobx-react-lite";
import Axios from "axios";
import { usePosition } from 'use-position';


export default function Map() {
	const [ready, setReady] = useState(false);
	const [tier, setTier] = useState([]);
	const [circ, setCirc] = useState([]);
	const [voi, setVoi] = useState([]);
	const [lat, setLat] = useState('');
	const [long, setLong] = useState('');
	const { latitude, longitude } = usePosition();

	useEffect(() => {
		loadTiers();
		loadCircs();
		loadVois();
	}, [long, lat]);

	const loadTiers = async () => {
		return await getTiers();
	};

	const loadCircs = async () => {
		return await getCircs();
	};

	const loadVois = async () => {
		return await getVois();
	};

	function showMap() {
		setLat(latitude);
		setLong(longitude);
		setReady(true);
	}

	async function getTiers() {
		try {
			const tempTiers = (await Axios.get(`https://cors-anywhere.herokuapp.com/https://platform.tier-services.io/vehicle?lat=${lat}&lng=${long}&radius=5000`, {
				headers: {
					"x-api-key": "bpEUTJEBTf74oGRWxaIcW7aeZMzDDODe1yBoSxi2",
				}
			})).data;

			setTier(tempTiers.data);
		} catch (e) {
			console.log(e.message);
		}
	}

	async function getCircs() {
		try {
			const tempCirc = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.92&userLongitude=10.75&lang=en&latitude=${lat}&longitude=${long}&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc2 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.92&userLongitude=10.75&lang=en&latitude=${lat}&longitude=${long}&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc3 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.92&userLongitude=10.75&lang=en&latitude=${lat}&longitude=${long}&latitudeDelta=1&longitudeDelta=1`)).data;
			const combinedData = {...tempCirc,...tempCirc2,...tempCirc3}
			setCirc(combinedData.Data.Scooters);
		} catch (e) {
			console.log(e.message);
		}
	}

	async function getVois() {
		try {
			const tempVoi = (await Axios.get(`https://shrouded-eyrie-46546.herokuapp.com/`)).data;
			setVoi(tempVoi);
		} catch(e) {
			console.log(e.message);
		}
	}

	const addMarkers = (one, two, three) => map => {
		one.forEach(ti => {
			new window.google.maps.Marker({
				map,
				icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
				position: { lat: ti.lat, lng: ti.lng },
				title: ti.id
			});
		});
		two.forEach(ti => {
			new window.google.maps.Marker({
				map,
				icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
				position: {
					lat: ti.location.latitude,
					lng: ti.location.longitude
				},
				title: ti.ScooterCode
			});
		});
		three.forEach(ti => {
			new window.google.maps.Marker({
				map,
				icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
				position: { lat: ti.location[0], lng: ti.location[1] },
				title: ti.id
			});
		});
		new window.google.maps.Marker({
			map,
			position:  { lat: lat, lng: long },
			title: "userPosition"
		});
	}


	const mapProps = {
		options: {
			center: { lat: lat, lng: long },
			zoom: 17
		},
		onMount: addMarkers(tier,circ,voi)
	};

	return useObserver(() => (
		<>
			<h1>Tier and Circ el-scooters near you!</h1>
			{(!ready) 
			?	<button
					onClick={showMap}
				>Find scooters near me!</button>
			:	<MapComponent {...mapProps}></MapComponent>
			}
		</>
	));
}
