<script setup>
	import { onMounted } from 'vue';
	import { loadScript } from 'vue-plugin-load-script';

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

	async function createMap(L) {
		const map = L.map('map').setView([51.505, -0.09], 13);
		L.tileLayer('https://tile.openstreetmap.org/50/50/50.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);
	}

	onMounted(async () => {
		const L = await loadScript(
			'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
		);
		console.log(L);
	});
</script>

<template>
	<link
		rel="stylesheet"
		href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
	<div @mousemove="mouseMove">
		<div id="map" style="{{  height: 500px; width: 500px }}"></div>
		<h1 @click="getData">Hello</h1>
		<form action="" id="form" @submit="handleSubmit">
			<input type="text" placeholder="lat" name="lat" id="lat" />
			<input type="text" placeholder="lng" name="lng" id="lng" />
			<button>Submit</button>
		</form>
		<h2 id="output"></h2>
	</div>
</template>
