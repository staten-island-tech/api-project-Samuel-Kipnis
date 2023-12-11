<script setup>
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
		console.log(data);
	}
</script>

<template>
	<div @mousemove="mouseMove">
		<h1 @click="getData">Hello</h1>
		<form action="" id="form" @submit="handleSubmit">
			<input type="text" placeholder="lat" name="lat" id="lat" />
			<input type="text" placeholder="lng" name="lng" id="lng" />
			<button>Submit</button>
		</form>
		<h2 id="output"></h2>
	</div>
</template>
