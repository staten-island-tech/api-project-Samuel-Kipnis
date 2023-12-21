<script setup>
	import './style.css';
	import 'leaflet/dist/leaflet.css';

	import { onMounted, ref } from 'vue';
	import L from 'leaflet';

	import DataDisplay from './components/DataDisplay.vue';

	const countryData = ref({});

	function getData(lat, lng) {
		fetch(
			'http://localhost:8080/api/getcountryByCoords?' +
				new URLSearchParams({
					lat,
					lng,
				})
		)
			.then((res) => res.json())
			.then((data) => (countryData.value = data.geonames[0]));
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

		map.on('click', async (e) => {
			const data = await getData(e.latlng.lat, e.latlng.lng);
			displayData(data);
		});
	}

	onMounted(() => {
		setTimeout(1000, loadMap());
	});
</script>

<template>
	<link
		rel="stylesheet"
		href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
	<div id="map"></div>
	<p>{{ countryData }}</p>
	<h2 id="output">
		{{ countryData.countryName }}, {{ countryData.continentName }}
	</h2>
	<h2 id="output">{{ Number(countryData.areaInSqKm) }}</h2>
</template>
