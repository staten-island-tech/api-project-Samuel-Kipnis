<script setup>
	function getData() {
		fetch('http://localhost:8080/api/getCountryByCoords')
			.then((res) => res.text())
			.then((text) => console.log(text));
	}

	function mouseMove(e) {
		if (e.target.tagName === 'IMG') {
			let map = e.target;
			let mapRect = map.getBoundingClientRect();
			console.log(mapRect);
			let xToLongRatio = mapRect.width / 180;
			console.log(e.clientX / xToLongRatio);
		}
	}
</script>

<template>
	<div @mousemove="mouseMove">
		<h1 @click="getData">Hello</h1>
		<img src="https://geology.com/world/world-map.gif" alt="" id="map" />
	</div>
</template>
