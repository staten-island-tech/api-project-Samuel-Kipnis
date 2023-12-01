<script setup>
	// fetch('/').then((res) => {
	// 	console.log(res);
	// });
	function getData() {
		fetch('http://localhost:8080/api/getCountryByCoords')
			.then((res) => res.json())
			.then((data) => console.log(data));
		// .then((data) => console.log(data));
	}
</script>

<template>
	<div>
		<h1 @click="getData">Hello</h1>
	</div>
</template>
