import express from 'express';
import cors from 'cors';
import getCountryByCoords from './api/getCountryByCoords.js';

const app = express();
const port = 8080;

const corsOptions = {
	origin: 'http://localhost:5173',
	optionsSuccessStatus: 200,
};

app.get('/api/getCountryByCoords', cors(corsOptions), async (req, res) => {
	console.log(req.params);
	const country = await getCountryByCoords();
	res.send(country);
});

app.listen(port, () => {
	console.log('Server running on port', port);
});
