<script setup>
	import 'leaflet/dist/leaflet.css';

	import { onMounted, shallowRef } from 'vue';
	import L from 'leaflet';

	const API_KEY_GEOAPIFY = '66decfe51472480aa0ac1acc9a6b4d06';
	const API_KEY_COUNTRYAPI = 'OSFv+UtNLeNjw8Y+SnqxVw==1Ixy6zD5UCHaJhEt';

	//
	//
	// I apologize in advance for how terrible this code is.
	//
	//

	const countryData = shallowRef({
		datasource: {
			sourcename: 'openstreetmap',
			attribution: '© OpenStreetMap contributors',
			license: 'Open Database License',
			url: 'https://www.openstreetmap.org/copyright',
		},
		name: 'Staten Island Technical High School',
		country: 'United States',
		country_code: 'us',
		state: 'New York',
		city: 'New York',
		postcode: '10306',
		district: 'Oakwood',
		suburb: 'Staten Island',
		street: 'Clawson Street',
		housenumber: '485',
		lon: -74.11752987677912,
		lat: 40.5680455,
		state_code: 'NY',
		distance: 0,
		result_type: 'amenity',
		formatted:
			'Staten Island Technical High School, 485 Clawson Street, New York, NY 10306, United States of America',
		address_line1: 'Staten Island Technical High School',
		address_line2:
			'485 Clawson Street, New York, NY 10306, United States of America',
		category: 'education.school',
		timezone: {
			name: 'America/New_York',
			offset_STD: '-05:00',
			offset_STD_seconds: -18000,
			offset_DST: '-04:00',
			offset_DST_seconds: -14400,
			abbreviation_STD: 'EST',
			abbreviation_DST: 'EDT',
		},
		plus_code: '87G7HV9J+6X',
		plus_code_short: 'HV9J+6X New York, New York, United States',
		rank: {
			importance: 0.30799018260571026,
			popularity: 6.037574081390967,
		},
		place_id:
			'516e44089c858752c059ea9106b7b5484440f00102f9015d6e273600000000c0020192032353746174656e2049736c616e6420546563686e6963616c2048696768205363686f6f6c',
	});
	const econData = shallowRef({
		gdp: 20580223,
		sex_ratio: 97.9,
		surface_area: 9833517,
		life_expectancy_male: 76.3,
		unemployment: 3.9,
		imports: 2567490,
		homicide_rate: 5,
		currency: {
			code: 'USD',
			name: 'Us Dollar',
		},
		iso2: 'US',
		employment_services: 79,
		employment_industry: 19.7,
		urban_population_growth: 0.9,
		secondary_school_enrollment_female: 98.7,
		employment_agriculture: 1.3,
		capital: 'Washington, D.C.',
		co2_emissions: 4761.3,
		forested_area: 33.9,
		tourists: 79746,
		exports: 1644280,
		life_expectancy_female: 81.3,
		post_secondary_enrollment_female: 102,
		post_secondary_enrollment_male: 75,
		primary_school_enrollment_female: 101.4,
		infant_mortality: 5.8,
		gdp_growth: 2.9,
		threatened_species: 1655,
		population: 331003,
		urban_population: 82.5,
		secondary_school_enrollment_male: 99.2,
		name: 'United States',
		pop_growth: 0.6,
		region: 'Northern America',
		pop_density: 36.2,
		internet_users: 87.3,
		gdp_per_capita: 62917.9,
		fertility: 1.8,
		refugees: 1043.2,
		primary_school_enrollment_male: 102.2,
	});

	function getData(lat, lon) {
		const load = document.querySelector('.loading');
		load.id = 'loading';
		document.body.style.pointerEvents = 'none';

		fetch(
			'https://api.geoapify.com/v1/geocode/reverse?' +
				new URLSearchParams({
					lat,
					lon,
					apiKey: API_KEY_GEOAPIFY,
				})
		)
			.then((res) => res.json())
			.then((data) => {
				console.log(data.features[0].properties);
				if (
					data.features[0].properties.country !== undefined &&
					data.features[0].properties.country !== 'Antarctica'
				) {
					countryData.value = data.features[0].properties;
					getCountryData();
				} else {
					econData.value = {};
					countryData.value = {};
					load.id = '';
					document.body.style.pointerEvents = 'auto';
				}
			});
	}

	function getCountryData() {
		fetch(
			'https://api.api-ninjas.com/v1/country?' +
				new URLSearchParams({
					name: countryData.value.country,
				}),
			{
				headers: {
					'X-Api-Key': API_KEY_COUNTRYAPI,
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				econData.value = data[0];
				console.log(data[0]);
			})
			.then(() => {
				const load = document.querySelector('.loading');

				const bars = document.querySelectorAll('.myBar');
				bars.forEach((bar) => {
					let percent;
					try {
						if (bar.id === 'wealth') {
							percent =
								100 * (econData.value.gdp_per_capita / 70000);
						}
						if (bar.id === 'life_expectancy') {
							percent =
								100 *
								(((econData.value.life_expectancy_female +
									econData.value.life_expectancy_male) /
									2 -
									54) /
									(87 - 54));
						}
						if (bar.id === 'trade') {
							percent =
								100 *
								(econData.value.exports /
									(econData.value.imports * 2));
						}
						if (bar.id === 'safety') {
							percent =
								100 - 100 * (econData.value.homicide_rate / 53);
						}
						if (bar.id === 'modernization') {
							percent =
								100 *
								(econData.value.urban_population / 100 / 2 +
									econData.value.employment_services /
										100 /
										2);
						}
						if (bar.id === 'co2_emissions') {
							percent =
								100 * (econData.value.co2_emissions / 10000);
						}
					} catch (error) {
						percent = 0;
					}

					console.log(percent);
					bar.style.width = percent + '%';
					bar.style.backgroundColor = perc2color(percent);
					if (bar.id === 'co2_emissions') {
						bar.style.backgroundColor = perc2color(100 - percent);
					}
					load.id = '';
					document.body.style.pointerEvents = 'auto';
				});
			})
			.catch(() => {
				const load = document.querySelector('.loading');

				econData.value = {};
				countryData.value = {};
				load.id = '';
				document.body.style.pointerEvents = 'auto';
			});
	}

	function loadMap() {
		//create map object and set default positions and zoom level
		const map = L.map('map', {
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

	function numberWithCommas(x) {
		if (x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		} else {
			return false;
		}
	}

	function perc2color(perc) {
		var r,
			g,
			b = 0;
		if (perc < 50) {
			r = 255;
			g = Math.round(5.1 * perc);
		} else {
			g = 255;
			r = Math.round(510 - 5.1 * perc);
		}
		var h = r * 0x10000 + g * 0x100 + b * 0x1;
		return '#' + ('000000' + h.toString(16)).slice(-6);
	}

	onMounted(loadMap);
	onMounted(() => {
		document.body.style.background = 'rgb(249, 250, 251)';
		const bars = document.querySelectorAll('.myBar');
		bars.forEach((bar) => {
			let percent;
			if (bar.id === 'wealth') {
				percent = 100 * (econData.value.gdp_per_capita / 70000);
			}
			if (bar.id === 'life_expectancy') {
				percent =
					100 *
					(((econData.value.life_expectancy_female +
						econData.value.life_expectancy_male) /
						2 -
						54) /
						(87 - 54));
			}
			if (bar.id === 'trade') {
				percent =
					100 *
					(econData.value.exports / (econData.value.imports * 2));
			}
			if (bar.id === 'safety') {
				percent = 100 - 100 * (econData.value.homicide_rate / 53);
			}
			if (bar.id === 'modernization') {
				percent =
					100 *
					(econData.value.urban_population / 100 / 3 +
						econData.value.employment_services / 100 / 3 +
						econData.value.internet_users / 100 / 3);
			}
			if (bar.id === 'co2_emissions') {
				percent = 100 * (econData.value.co2_emissions / 10000);
			}
			if (bar.id === 'education') {
				percent = 100 * (econData.value.co2_emissions / 10000);
			}

			console.log(percent);
			bar.style.width = percent + '%';
			bar.style.backgroundColor = perc2color(percent);

			if (bar.id === 'co2_emissions') {
				bar.style.backgroundColor = perc2color(100 - percent);
			}
		});
	});
</script>
<template>
	<div class="flex flex-row bg-gray-50">
		<div class="loading"></div>
		<div class="flex flex-col pb-3 m-auto">
			<header>
				<h1
					class="text-4xl p-3 text-center bg-gray-50 border-b-3 pb-5"
					id="title">
					Data About
					<span class="text-emerald-800">{{
						countryData.country || 'N/A, Please Click on Land'
					}}</span>
				</h1>
			</header>
			<div class="flex flex-row">
				<div id="map" class="rounded-xl"></div>
				<div class="rounded-xl bg-gray-50 px-3">
					<h2
						class="text-2xl text-center bg-gray-50 border-b-3"
						id="title">
						Economic Data
					</h2>
					<table
						class="w-full text-sm text-left rtl:text-right text-gray-500">
						<thead
							class="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" class="px-6 py-3">Statistic</th>
								<th scope="col" class="px-6 py-3">Value</th>
							</tr>
						</thead>
						<tbody>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									Gross Domestic Product
								</th>
								<td class="px-6 py-4">
									${{
										numberWithCommas(
											econData.gdp * 1000000
										) || 'N/A'
									}}
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									GDP Growth
								</th>
								<td class="px-6 py-4">
									{{ econData.gdp_growth || 'N/A' }}% Per Year
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									GDP Per Capita
								</th>
								<td class="px-6 py-4">
									${{
										numberWithCommas(
											econData.gdp_per_capita
										) || 'N/A'
									}}
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									Exports
								</th>
								<td class="px-6 py-4">
									${{
										numberWithCommas(
											econData.exports * 1000000
										) || 'N/A'
									}}
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									Imports
								</th>
								<td class="px-6 py-4">
									${{
										numberWithCommas(
											econData.imports * 1000000
										) || 'N/A'
									}}
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									Unemployment
								</th>
								<td class="px-6 py-4">
									{{ econData.unemployment || 'N/A' }}%
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									Carbon Dioxide Emissions
								</th>
								<td class="px-6 py-4">
									{{
										numberWithCommas(
											econData.co2_emissions * 1000000
										) || 'N/A'
									}}
									mt
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
									Internet Users
								</th>
								<td class="px-6 py-4">
									{{ econData.internet_users || 'N/A' }}%
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="rounded-xl bg-gray-50 px-3">
					<h2
						class="text-2xl text-center bg-gray-50 border-b-3"
						id="title">
						Population Data
					</h2>
					<table
						class="w-full text-sm text-left rtl:text-right text-gray-500">
						<thead
							class="text-xs text-gray-700 uppercase bg-gray-50">
							<tr>
								<th scope="col" class="px-6 py-3">Statistic</th>
								<th scope="col" class="px-6 py-3">Value</th>
							</tr>
						</thead>
						<tbody>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Population
								</th>
								<td class="px-6 py-4">
									{{
										numberWithCommas(
											econData.population * 1000
										) || 'N/A'
									}}
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Life Expectancy - Male
								</th>
								<td class="px-6 py-4">
									{{ econData.life_expectancy_male || 'N/A' }}
									Years
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Life Expectancy - Female
								</th>
								<td class="px-6 py-4">
									{{
										econData.life_expectancy_female || 'N/A'
									}}
									Years
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Fertility Rate
								</th>
								<td class="px-6 py-4">
									{{ econData.fertility || 'N/A' }} Per Couple
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Infant Mortality
								</th>
								<td class="px-6 py-4">
									{{ econData.infant_mortality || 'N/A' }}%
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Homicide Rate
								</th>
								<td class="px-6 py-4">
									{{ econData.homicide_rate || 'N/A' }} Per
									100,000
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Urban Population
								</th>
								<td class="px-6 py-4">
									{{ econData.urban_population || 'N/A' }}%
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Population Density
								</th>
								<td class="px-6 py-4">
									{{ econData.pop_density || 'N/A' }} Per
									km<sup>2</sup>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="rounded-xl bg-gray-50 px-3">
					<h2
						class="text-2xl text-center bg-gray-50 border-b-3"
						id="title">
						Data Ratings
					</h2>
					<table
						class="w-full text-sm text-left rtl:text-right text-gray-500">
						<thead
							class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
							<tr>
								<th scope="col" class="px-6 py-3">Statistic</th>
								<th scope="col" class="px-6 py-3">Value</th>
							</tr>
						</thead>
						<tbody>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Wealth
								</th>
								<td class="px-6 py-4">
									<div class="myProgress bg-gray-50">
										<div class="myBar" id="wealth"></div>
									</div>
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Life Expectancy
								</th>
								<td class="px-6 py-4">
									<div class="myProgress bg-gray-50">
										<div
											class="myBar"
											id="life_expectancy"></div>
									</div>
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Trade Deficit / Surplus
								</th>
								<td class="px-6 py-4">
									<div class="myProgress bg-gray-50">
										<div class="myBar" id="trade"></div>
									</div>
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Safety
								</th>
								<td class="px-6 py-4">
									<div class="myProgress bg-gray-50">
										<div class="myBar" id="safety"></div>
									</div>
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									Modernization
								</th>
								<td class="px-6 py-4">
									<div class="myProgress bg-gray-50">
										<div
											class="myBar"
											id="modernization"></div>
									</div>
								</td>
							</tr>
							<tr class="bg-white border-b">
								<th
									scope="row"
									class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
									CO2 Emissions
								</th>
								<td class="px-6 py-4">
									<div class="myProgress bg-gray-50">
										<div
											class="myBar"
											id="co2_emissions"></div>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
