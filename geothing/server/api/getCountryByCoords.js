import { url, username } from './apiInfo.js';

async function getCountryByCoords(lat, lng) {
	console.log(lat, lng);
	const countryCode = await fetch(
		`${url}/countryCode?` +
			new URLSearchParams({
				username,
				lat,
				lng,
			})
	).then((res) => res.text().then((text) => text.slice(0, 2)));

	console.log(countryCode);

	const countryData = await fetch(
		`${url}/countryInfoJSON?` +
			new URLSearchParams({
				username,
				country: countryCode,
			})
	).then((res) => res.json());

	return countryData;
}

export default getCountryByCoords;
