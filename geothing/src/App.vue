<script setup>
	import './style.css';

	import { onMounted } from 'vue';
	import L from 'leaflet';

	function getData(lat, lng) {
		fetch(
			'http://localhost:8080/api/getCountryByCoords?' +
				new URLSearchParams({
					lat,
					lng,
				})
		)
			.then((res) => res.json())
			.then((data) => displayData(data.geonames[0].countryName));
	}

	function displayData(data) {
		const output = document.querySelector('#output');
		output.textContent = data;
	}

	function loadMap() {
		//create map object and set default positions and zoom level
		const map = L.map('map', {
			zoomControl: false,
			maxBoundsViscosity: 1,
			minZoom: 1,
		});

		map.setView([0, 0], 1);
		map.setMaxBounds(map.getBounds());
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);

		map.on('click', (e) => {
			getData(e.latlng.lat, e.latlng.lng);
		});
	}

	onMounted(loadMap);
</script>

<template>
	<link
		rel="stylesheet"
		href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
	<div @mousemove="mouseMove">
		<div id="map"></div>
		<h1 @click="getData">Hello</h1>
		<h2 id="output"></h2>
	</div>
</template>
