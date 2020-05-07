import { NextFunction, Response, Router } from 'express';

import Day from '../data/day';
import { parseDays } from '../data/parse';
import { retrieve } from '../data/retrieve';

const route = <T>(getData: (d: Day) => T | undefined) => async (req: any, res: Response, next: NextFunction) => {
	try {
		const rawData = await retrieve();
		if (!rawData)
			throw new Error("Could not retrieve data.");

		const parsed = parseDays(rawData.caseArr, rawData.hospitalArr, rawData.testData);
		const parsedJSON = parsed.sortBy((_v, k) => k);

		const requestedData = parsedJSON
			.map(getData)
			.filter((v: T | undefined): v is T => v != undefined);

		res.json(requestedData);
	} catch (err) {
		next(err);
	}
}

let JSONRouter = Router();

JSONRouter.get('/all.json', route((d) => d));
JSONRouter.get('/cases.json', route((d) => d.cases));
JSONRouter.get('/hospitalizations.json', route((d) => d.hospitalizations));
JSONRouter.get('/tests.json', route((d) => d.tests));

JSONRouter.use((err: Error | undefined, req: any, res: Response<any>, next: NextFunction) => {
	const msg = err?.message || "Something went wrong.";

	res.status(500).json({
		error: msg
	});
});

export default JSONRouter;