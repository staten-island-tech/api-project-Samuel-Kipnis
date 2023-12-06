import { url, username } from './apiInfo.js';

function getCountryByCoords(lat = 30, lng = -90) {
	return fetch(
		`${url}/countryCode?` +
			new URLSearchParams({
				username,
				lat,
				lng,
			})
	).then((res) => res.text());
}

export default getCountryByCoords;
