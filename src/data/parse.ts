import { List, Map } from 'immutable';

import Day, { Cases, Hospitalizations, Tests } from './day';
import { CaseArrItem, HospitalArrItem, TestDataItem } from './retrieve';

const CASEARR_DATE_COLUMN = 0;
const CASEARR_CASE_COLUMN = 1;
const CASEARR_CUM_COLUMN = 2;

const HOSPITALARR_DATE_COLUMN = 0;
const HOSPITALARR_HOSP_COLUMN = 1;
const HOSPITALARR_ICU_COLUMN = 2;
const HOSPITALARR_REPORTING_COLUMN = 3;

const TESTDATA_DATE_COLUMN = 0;
const TESTDATA_TEST_COLUMN = 2;
const TESTDATA_CUM_COLUMN = 3;

function parseDate(s: string): Date {
	const firstSlash = s.indexOf('/');
	const secondSlash = s.lastIndexOf('/');

	const month = s.slice(0, firstSlash);
	const day = s.slice(firstSlash + 1, secondSlash);
	const year = s.slice(secondSlash + 1);

	const timestamp = Date.parse(year + "-" + month + "-" + day);
	return new Date(timestamp);
}

const parseCaseItem = (c: CaseArrItem): Cases => ({
	today: c[CASEARR_CASE_COLUMN],
	cumulative: c[CASEARR_CUM_COLUMN]
});

const parseHospitalzationItem = (h: HospitalArrItem): Hospitalizations => ({
	today: h[HOSPITALARR_HOSP_COLUMN],
	icu: h[HOSPITALARR_ICU_COLUMN],
	hospitalsReporting: h[HOSPITALARR_REPORTING_COLUMN]
});

const parseTestItem = (t: TestDataItem): Tests => ({
	today: t[TESTDATA_TEST_COLUMN],
	cumulative: t[TESTDATA_CUM_COLUMN]
});

export function parseDays(caseArr: CaseArrItem[], hospitalArr: HospitalArrItem[], testData: TestDataItem[]): Map<string, Day> {
	const caseDays: [string, Day][] = caseArr.map(c => ([
		parseDate(c[CASEARR_DATE_COLUMN]).toString(),
		{ date: parseDate(c[CASEARR_DATE_COLUMN]), cases: parseCaseItem(c) }
	]));

	const hospitalizationDays: [string, Day][] = hospitalArr.map(h => ([
		parseDate(h[HOSPITALARR_DATE_COLUMN]).toString(),
		{ date: parseDate(h[HOSPITALARR_DATE_COLUMN]), hospitalizations: parseHospitalzationItem(h) }
	]));

	const testDays: [string, Day][] = testData.map(t => ([
		parseDate(t[TESTDATA_DATE_COLUMN]).toString(),
		{ date: parseDate(t[TESTDATA_DATE_COLUMN]), tests: parseTestItem(t) }
	]));

	console.log(caseDays);

	const casesMap = Map<string, Day>(caseDays);


	const hospitalzationsAndCasesMap = hospitalizationDays.reduce(	// fold hospitalizations into map
		(p, [d, h]) => p.set(d, { ...p.get(d, h), hospitalizations: h.hospitalizations })
		, casesMap
	);

	const daysMap = testDays.reduce(								// fold tests into map
		(p, [d, t]) => p.set(d, { ...p.get(d, t), tests: t.tests })
		, hospitalzationsAndCasesMap
	);

	return daysMap;
}