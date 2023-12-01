import express from 'express';
import cors from 'cors';

import router from './router';

app.use('/', router);

const app = express();
const port = 8080;

app.listen(port, () => {
	console.log('Server running on port', port);
});
