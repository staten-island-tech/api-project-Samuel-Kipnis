import { url, username } from './base';

function getCountryByCoords(lat = 30, long = 30) {
	fetch(
		`${url}/countryCode?` +
			new URLSearchParams({
				username,
				lat,
				long,
			})
	);
}

export default getCountryByCoords;
