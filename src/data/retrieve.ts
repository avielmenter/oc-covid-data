import NodeFetch from 'node-fetch';

export type CaseArrItem = [string, number, number, number];
export type HospitalArrItem = [string, number, number, number];
export type TestDataItem = [string, number, number, number, number, number];

export interface RawData {
	readonly caseArr: CaseArrItem[],
	readonly hospitalArr: HospitalArrItem[],
	readonly testData: TestDataItem[]
}

const DATA_URL = "https://occovid19.ochealthinfo.com/coronavirus-in-oc";

const getArrayInLine = (l: string) => JSON.parse(
	l.substring(l.indexOf('['), l.length - 1) // cut off trailing ';'
);

export async function retrieve(): Promise<RawData | undefined> {
	const res = await NodeFetch(DATA_URL);
	const text = await res.text();

	const lines = text.split('\n').map(l => l.trim());

	const caseArrLine = lines.filter(l => l.startsWith("var caseArr = [["))[0];
	const hospitalArrLine = lines.filter(l => l.startsWith("var hospitalArr = [["))[0];
	const testDataLine = lines.filter(l => l.startsWith("var testData = [["))[0];

	if (!caseArrLine || !hospitalArrLine || !testDataLine)
		return undefined;

	const caseArr = getArrayInLine(caseArrLine) as CaseArrItem[];
	const hospitalArr = getArrayInLine(hospitalArrLine) as HospitalArrItem[];
	const testData = getArrayInLine(testDataLine) as TestDataItem[];

	return {
		caseArr,
		hospitalArr,
		testData
	};
}