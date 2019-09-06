import React, { useEffect, useRef } from "react";

export default function Map({ options, onMount, className }) {
	const props = { ref: useRef(), className };
	const onLoad = () => {
		const map = new window.google.maps.Map(props.ref.current, options);
		onMount && onMount(map);
	};

	useEffect(() => {
		if (!window.google) {
			const script = document.createElement(`script`);
			script.type = `text/javascript`;
			script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAwigGT9JnBUzMbG5UO5Ot_Oheakj2UHlw`;
			const headScript = document.getElementsByTagName(`script`)[0];
			headScript.parentNode.insertBefore(script, headScript);
			script.addEventListener(`load`, onLoad);
			return () => script.removeEventListener(`load`, onLoad);
		} else onLoad();
	});

	return (
		<div
			{...props}
			style={{ height: `70vh`, margin: `1em 0`, borderRadius: `0.5em` }}
		/>
	);
}

Map.defaultProps = {
	options: {
		center: { lat: 48, lng: 8 },
		zoom: 5
	}
};
