import * as Express from 'express';

import CSVRouter from './routes/csv';
import JSONRouter from './routes/json';

const PORT = process.env.PORT || 3000;
const app: Express.Application = Express();

app.get('/', async (req, res) => {
	res.redirect('https://github.com/avielmenter/oc-covid-data#readme')
});

app.use('/csv', CSVRouter);
app.use('/json', JSONRouter);

app.listen(PORT, () => {
	console.log(`oc-covid-data is listening on port ${PORT}`);
});