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
			.then((res) => res.text())
			.then((text) => displayData(text));
	}

	function displayData(data) {
		const output = document.querySelector('#output');
		output.textContent = data;
	}

	function handleSubmit(e) {
		const form = document.querySelector('#form');

		e.preventDefault();
		const data = getData(
			document.querySelector('#lat').value,
			document.querySelector('#lng').value
		);
	}

	function loadMap() {
		//create map object and set default positions and zoom level
		const map = L.map('map', {}).setView([0, 0], 1);
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
		<form action="" id="form" @submit="handleSubmit">
			<input type="text" placeholder="lat" name="lat" id="lat" />
			<input type="text" placeholder="lng" name="lng" id="lng" />
			<button>Submit</button>
		</form>
		<h2 id="output"></h2>
	</div>
</template>
