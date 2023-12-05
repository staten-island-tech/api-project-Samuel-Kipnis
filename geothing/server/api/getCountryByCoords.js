import { url, username } from './apiInfo.js';

async function getCountryByCoords(lat = 30, lng = 30) {
	const res = await fetch(
		`${url}/countryCode?` +
			new URLSearchParams({
				username,
				lat,
				lng,
			})
	);
	return res;
}

export default getCountryByCoords;
