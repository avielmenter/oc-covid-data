# OC CoViD Data
An API to present Orange County, California's CoViD-19 data in a computer readable format.

# API
API requests can be made to any endpoint in the following format:

`https://oc-covid-data.herokuapp.com/(all|cases|hospitalizations|tests).(csv|json)`

The first parameter specifies whether you would like to request all available data, or just data on cases, hospitalizations, or tests. The second parameter specifies whether the data should be returned in CSV or JSON format.

## GET (all|cases|hospitalizations|tests).json
JSON endpoints return data in the following format. If only data on cases, hospitalizations, or tests are requested, then other data will not be included in the response, nor will days without the requested kind of data.

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

If a request to a JSON endpoint results in an error, the endpoint returns an error message in the following format:

```javascript
{
    error: String   // a message explaining the error
}
```

## GET /(all|cases|hospitalizations|tests).csv
CSV endpoints return data in the following format. If only data on cases, hospitalizations, or tests are requested, then the columns for other data will not be included in the response, and days without the requested kind of data will be excluded.

```csv
"date","casesCumulative","casesToday","hospitalizationsICU","hospitalizationsReporting","hospitalizationsToday","testsCumulative","testsToday"
```

If a request to a CSV endpoint results in an error, the endpoint returns an error message in the following format:

```csv
"error"
```

# Setup
## Prerequisites
To install run this project yourself, you must already have the latest version of [Node.js](https://nodejs.org/en/) installed.

## Installation
To install this web application, perform the following steps:
1. Clone this repository via the command `git clone https://github.com/avielmenter/oc-covid-data.git`
2. Navigate to the `oc-covid-data` folder.
3. Run the command `npm install`.

# Run
To run an oc-covid-data server, navigate to the `oc-covid-data` folder, and start the application using the command `npm start`.

You can also compile and run this project in developer mode by using the `npm run start:dev` command. This command will recompile the project whenever a code file in the `/src` folder is changed.

# License
This repository is licensed under the [MIT License](https://github.com/avielmenter/oc-covid-data/blob/master/LICENSE).
