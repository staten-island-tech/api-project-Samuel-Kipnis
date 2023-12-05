<script setup>
	// fetch('/').then((res) => {
	// 	console.log(res);
	// });
	function getData() {
		let data = fetch('http://localhost:8080/api/getCountryByCoords')
			.then(async (res) => await res.json())
			.then((data) => console.log(data));
		// .then((body) => console.log(data));
	}
</script>

<template>
	<div>
		<h1 @click="getData">Hello</h1>
	</div>
</template>
