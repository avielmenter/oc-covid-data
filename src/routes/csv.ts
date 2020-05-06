import { Router } from 'express';
import { List, Map } from 'immutable';

import Day, { Cases, Tests, Hospitalizations } from '../data/day';

import { parseDays } from '../data/parse';
import { retrieve } from '../data/retrieve';

async function getParsedData() {
	const rawData = await retrieve();
	if (!rawData)
		throw new Error("Could not retrieve data.");

	return parseDays(rawData.caseArr, rawData.hospitalArr, rawData.testData);
}

const toKeyArray = (obj: { [key: string]: any }): string[] => Object.keys(obj).sort();
const toValueArray = (obj: { [key: string]: any }): string[] => toKeyArray(obj).map(k => obj[k]);

const dummyCases: Cases = {
	today: -1,
	cumulative: -1
};

const dummyHospitalizations: Hospitalizations = {
	today: -1,
	icu: -1,
	hospitalsReporting: -1
};

const dummyTests: Tests = {
	today: -1,
	cumulative: -1
};

const dummyRow = {
	casesToday: -1,
	casesCumulative: -1,
	hospitalizationsToday: -1,
	hospitalizationsReporting: -1,
	hospitalizationsICU: -1,
	testsToday: -1,
	testsCumulative: -1
};

const dayToRow = (d: Day) => ({
	casesToday: d.cases?.today,
	casesCumulative: d.cases?.cumulative,
	hospitalizationsToday: d.hospitalizations?.today,
	hospitalizationsReporting: d.hospitalizations?.hospitalsReporting,
	hospitalizationsICU: d.hospitalizations?.icu,
	testsToday: d.tests?.today,
	testsCumulative: d.tests?.cumulative
});

const parseDataItem = <T>(dummy: T, item: T | undefined): (string | undefined)[] => item
	? toValueArray(item)
	: toValueArray(dummy).map(_k => undefined);

const parseRow = (row: List<string | undefined>): string => row.reduce(
	(p, col) => p
		+ (p == "" ? "" : ",")
		+ (col
			? ("\"" + col + "\"")
			: ""
		)
	, ""
);

const parseTable = (table: List<List<(string | undefined)>>): string => table.reduce(
	(p, row) => p + "\n" + parseRow(row)
	, "");

function dataToTable<T>(dummyDataItem: T, getDataItem: (d: Day) => T | undefined, data: Map<string, Day>): List<List<string | undefined>> {
	const headerRow: List<string | undefined> = List(["date", ...toKeyArray(dummyDataItem)]);

	const dataRows = data.entrySeq()
		.map(([k, v]) => {
			const dataItem = getDataItem(v);
			if (!dataItem)
				return undefined;
			return List<string | undefined>([k, ...parseDataItem(dummyDataItem, dataItem)]);
		}).filter((r): r is List<string | undefined> => r != undefined)
		.toArray();

	return List<List<string | undefined>>([headerRow, ...dataRows]);
}

let CSVRouter = Router();

CSVRouter.get('/', async (req, res, next) => {
	try {
		const data = await getParsedData();
		const table = dataToTable(dummyRow, dayToRow, data);
		res.send(parseTable(table));
	} catch (err) {
		next(err);
	}
});

CSVRouter.get('/cases', async (req, res, next) => {
	try {
		const data = await getParsedData();
		const table = dataToTable(dummyCases, (d) => d.cases, data);
		res.send(parseTable(table));
	} catch (err) {
		next(err);
	}
});

CSVRouter.get('/hospitalizations', async (req, res, next) => {
	try {
		const data = await getParsedData();
		const table = dataToTable(dummyHospitalizations, (d) => d.hospitalizations, data);
		res.send(parseTable(table));
	} catch (err) {
		next(err);
	}
});

CSVRouter.get('/tests', async (req, res, next) => {
	try {
		const data = await getParsedData();
		const table = dataToTable(dummyTests, (d) => d.tests, data);
		res.send(parseTable(table));
	} catch (err) {
		next(err);
	}
});

export default CSVRouter;