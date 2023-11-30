<script setup>
	// fetch('/').then((res) => {
	// 	console.log(res);
	// });
	function getData() {
		fetch('/').then((res) => console.log(res));
	}
</script>

<template>
	<div>
		<h1 @click="getData">Hello</h1>
	</div>
</template>
