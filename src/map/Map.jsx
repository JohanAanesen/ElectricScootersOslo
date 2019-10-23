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
	const [lat, setLat] = useState('59.91');
	const [long, setLong] = useState('10.72');
	const { latitude, longitude } = usePosition();

	const [count, setCount] = useState(0);

	useEffect(() => {
		if (ready) {
			loadTiers();
			loadCircs();
			loadVois();
		}

	}, [long, lat, ready]);

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
		try { //59.917283, 10.714115
			const tempCirc = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=${lat}&userLongitude=${long}&lang=en&latitude=${lat}&longitude=${long}&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc2 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.92&userLongitude=10.75&lang=en&latitude=59.92&longitude=10.75&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc3 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.91&userLongitude=10.74&lang=en&latitude=59.91&longitude=10.74&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc4 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.91&userLongitude=10.71&lang=en&latitude=59.91&longitude=10.71&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc5 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.92&userLongitude=10.71&lang=en&latitude=59.92&longitude=10.71&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc6 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.92&userLongitude=10.72&lang=en&latitude=59.92&longitude=10.72&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc7 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.92&userLongitude=10.73&lang=en&latitude=59.92&longitude=10.73&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc8 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.91&userLongitude=10.74&lang=en&latitude=59.91&longitude=10.74&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc9 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.92&userLongitude=10.74&lang=en&latitude=59.92&longitude=10.74&latitudeDelta=1&longitudeDelta=1`)).data;
			const tempCirc10 = (await Axios.get(`https://api.goflash.com/api/Mobile/Scooters?userLatitude=59.93&userLongitude=10.74&lang=en&latitude=59.93&longitude=10.74&latitudeDelta=1&longitudeDelta=1`)).data;
			const combinedData = [...tempCirc.Data.Scooters, ...tempCirc2.Data.Scooters, ...tempCirc3.Data.Scooters, ...tempCirc4.Data.Scooters, ...tempCirc5.Data.Scooters, ...tempCirc6.Data.Scooters, ...tempCirc7.Data.Scooters, ...tempCirc8.Data.Scooters, ...tempCirc9.Data.Scooters, ...tempCirc10.Data.Scooters]

			setCirc(combinedData);
		} catch (e) {
			console.log(e.message);
		}
	}

	async function getVois() {
		try {
			const tempVoi = (await Axios.get(`https://shrouded-eyrie-46546.herokuapp.com/`)).data;
			setVoi(tempVoi);
		} catch (e) {
			console.log(e.message);
		}
	}

	const addMarkers = (one, two, three) => map => {
		let nrOfScooters = 0;
		nrOfScooters = one.length + two.length + three.length;
		setCount(nrOfScooters);

		one.forEach(ti => {
			new window.google.maps.Marker({
				map,
				icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
				position: { lat: ti.lat, lng: ti.lng },
				title: `${ti.id} - Battery: ${ti.batteryLevel}`
			});
		});
		two.forEach(ti => {
			new window.google.maps.Marker({
				map,
				icon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
				position: {
					lat: ti.location.latitude,
					lng: ti.location.longitude
				},
				title: `${ti.ScooterCode} - Battery: ${ti.PowerPercent} `
			});
		});
		three.forEach(ti => {
			new window.google.maps.Marker({
				map,
				icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
				position: { lat: ti.location[0], lng: ti.location[1] },
				title: `${ti.id} - Battery: ${ti.battery}`
			});
		});
		new window.google.maps.Marker({
			map,
			position: { lat: lat, lng: long },
			title: "userPosition"
		});
	}


	const mapProps = {
		options: {
			center: { lat: lat, lng: long },
			zoom: 17
		},
		onMount: addMarkers(tier, circ, voi)
	};

	return useObserver(() => (
		<>
			<h1>Tier, Voi and Circ el-scooters near you!</h1>
			<h1>{count} scooters loaded</h1>
			{(!ready)
				? <button
					onClick={showMap}
				>Find scooters near me!</button>
				: <MapComponent {...mapProps}></MapComponent>
			}
		</>
	));
}
