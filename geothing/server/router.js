import express from 'express';
import cors from 'cors';

const router = express.Router();

const corsOptions = {
	origin: 'http://localhost:5173',
	optionsSuccessStatus: 200,
};

router.get('/api/getCountryByCoords', cors(corsOptions), (req, res) => {
	res.json({ message: 'Hello, world!' });
});

export default router;
