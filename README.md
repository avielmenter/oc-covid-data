# OC CoViD Data
An API to present Orange County, California's CoViD-19 data in a computer readable format.

# Try It!
API requests should be made to [https://oc-covid-data.herokuapp.com/](https://oc-covid-data.herokuapp.com/).

# API
Data can be requested by making an HTTP GET request to one of the following routes:

## GET /json
Gets all CoViD data as a JSON array.

### Returns
This endpoint returns a JSON array in the following format:

```javascript
[{
    Date: {                             // the date on which the data were reported
        cases: {
            today: Number,              // the number of cases reported on this date
            cumulative: Number          // the total number of cases reported by this date
        } | undefined,
        hospitalizations: {
            today: Number,              // the number of people hospitalized on this date
            icu: Number,                // the number of people in the ICU on this date
            hospitalsReporting: Number, // the number of hospitals reporting data
        } | undefined,
        tests: {
            today: Number,              // the number of tests reported on this date
            cumulative: Number,         // the total number of tests reported by this date
        }
    }
}]
```

## GET /csv
Gets all CoViD data in comma-separated-value format.

### Returns
This endpoint returns CSV data in the following format:

```csv
"date","casesCumulative","casesToday","hospitalizationsICU","hospitalizationsReporting","hospitalizationsToday","testsCumulative","testsToday"
```

## GET /csv/cases
Gets data about the number of reported cases.

### Returns

This endpoint returns CSV data in the following format:

```csv
"date","cumulative","today"
```

## GET /csv/hospitalizations
Gets data about the number of reported hospitalizations.

### Returns
This endpoint returns CSV data in the following format:
```csv
"date","hospitalsReporting","icu","today"
```

## GET /csv/tests
Gets data about the number of reported tests.

### Returns
This endpoing returns CSV data in the following format:
```csv
"date","cumulative","today"
```

# License
This repository is licensed under the [GNU General Public License v3.0](https://github.com/avielmenter/oc-covid-data/blob/master/LICENSE).
