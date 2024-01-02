<script setup>
	import './style.css';
	import 'leaflet/dist/leaflet.css';

	import { onMounted, ref } from 'vue';
	import L from 'leaflet';

	import DataDisplay from './components/DataDisplay.vue';

	const countryData = ref({
		continent: 'NA',
		capital: 'Washington',
		languages: 'en-US,es-US,haw,fr',
		geonameId: 6252001,
		south: 24.543938895,
		isoAlpha3: 'USA',
		north: 49.3844873,
		fipsCode: 'US',
		population: '327167434',
		east: -66.949185723,
		isoNumeric: '840',
		areaInSqKm: '9629091.0',
		countryCode: 'US',
		west: -124.73259849600001,
		countryName: 'United States',
		postalCodeFormat: '#####-####',
		continentName: 'North America',
		currencyCode: 'USD',
	});

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
			getData(e.latlng.lat, e.latlng.lng);
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
	<div id="load"></div>
	<h2 id="output" :key="countryData">
		{{ countryData.countryName }},
		{{ countryData.continentName }}
	</h2>
	<h2 id="output">{{ Number(countryData.areaInSqKm) || '' }}</h2>
</template>
