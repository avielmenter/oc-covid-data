export interface Cases {
	readonly today: number,
	readonly cumulative: number
}

export interface Hospitalizations {
	readonly today: number,
	readonly icu: number,
	readonly hospitalsReporting: number
}

export interface Tests {
	readonly today: number,
	readonly cumulative: number
}

export default interface Day {
	readonly date: Date,
	readonly cases?: Cases,
	readonly tests?: Tests,
	readonly hospitalizations?: Hospitalizations
}
