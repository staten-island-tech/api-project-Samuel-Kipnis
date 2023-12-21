<script setup>
	import { getCurrentInstance } from 'vue';

	const props = defineProps(['country']);
	console.log(JSON.parse(JSON.stringify(props)));
</script>

<template>
	{{ props.country }}
</template>
