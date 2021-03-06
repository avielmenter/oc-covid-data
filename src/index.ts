import * as Express from 'express';
import * as Path from 'path';

import CSVRouter from './routes/csv';
import JSONRouter from './routes/json';

const PORT = process.env.PORT || 3000;
const app: Express.Application = Express();

app.get('/', async (req, res) => {
	res.redirect('https://github.com/avielmenter/oc-covid-data#readme')
});

app.use('/', CSVRouter);
app.use('/', JSONRouter);

app.use('*', (req, res) => {
	res.status(404).sendFile(Path.resolve(__dirname, '../public/404.html'));
});

app.listen(PORT, () => {
	console.log(`oc-covid-data is listening on port ${PORT}`);
});