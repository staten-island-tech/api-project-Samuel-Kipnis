import { url, username } from './base';

async function getCountryByCoords(lat = 30, long = 30) {
	await fetch(
		`${url}/countryCode?` +
			new URLSearchParams({
				username,
				lat,
				long,
			})
	)
		.then((res) => res.json())
		.then((data) => {
			return data;
		});
}

export default getCountryByCoords;
