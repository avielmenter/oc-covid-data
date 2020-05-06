import { NextFunction, Response, Router } from 'express';

import { parseDays } from '../data/parse';
import { retrieve } from '../data/retrieve';

let JSONRouter = Router();

JSONRouter.get('/', async (req, res, next) => {
	try {
		const rawData = await retrieve();
		if (!rawData)
			throw new Error("Could not retrieve data.");

		const parsed = parseDays(rawData.caseArr, rawData.hospitalArr, rawData.testData);
		const parsedJSON = parsed.sortBy((_v, k) => k);

		res.json(parsedJSON);
	} catch (err) {
		next(err);
	}
});

JSONRouter.use((err: Error | undefined, req: any, res: Response<any>, next: NextFunction) => {
	const msg = err?.message || "Something went wrong.";

	res.status(500).json({
		error: msg
	});
});

export default JSONRouter;