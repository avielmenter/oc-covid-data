"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var CASEARR_DATE_COLUMN = 0;
var CASEARR_CASE_COLUMN = 1;
var CASEARR_CUM_COLUMN = 2;
var HOSPITALARR_DATE_COLUMN = 0;
var HOSPITALARR_HOSP_COLUMN = 1;
var HOSPITALARR_ICU_COLUMN = 2;
var HOSPITALARR_REPORTING_COLUMN = 3;
var TESTDATA_DATE_COLUMN = 0;
var TESTDATA_TEST_COLUMN = 2;
var TESTDATA_CUM_COLUMN = 3;
function parseDate(s) {
    console.log("PARSING: ", s);
    var firstSlash = s.indexOf('/');
    var secondSlash = s.lastIndexOf('/');
    var month = s.slice(0, firstSlash - 1);
    var day = s.slice(firstSlash + 1, secondSlash - 1);
    var year = s.slice(secondSlash + 1);
    console.log("PARSED: ", year + '-' + month + '-' + day);
    var timestamp = Date.parse(year + "-" + month + "-" + day);
    return new Date(timestamp);
}
var parseCaseItem = function (c) { return ({
    today: c[CASEARR_CASE_COLUMN],
    cumulative: c[CASEARR_CUM_COLUMN]
}); };
var parseHospitalzationItem = function (h) { return ({
    today: h[HOSPITALARR_HOSP_COLUMN],
    icu: h[HOSPITALARR_ICU_COLUMN],
    hospitalsReporting: h[HOSPITALARR_REPORTING_COLUMN]
}); };
var parseTestItem = function (t) { return ({
    today: t[TESTDATA_TEST_COLUMN],
    cumulative: t[TESTDATA_CUM_COLUMN]
}); };
function parseDays(caseArr, hospitalArr, testData) {
    var caseDays = caseArr.map(function (c) { return ([
        parseDate(c[CASEARR_DATE_COLUMN]),
        { date: parseDate(c[CASEARR_DATE_COLUMN]), cases: parseCaseItem(c) }
    ]); });
    var hospitalizationDays = hospitalArr.map(function (h) { return ([
        parseDate(h[HOSPITALARR_DATE_COLUMN]),
        { date: parseDate(h[HOSPITALARR_DATE_COLUMN]), hospitalizations: parseHospitalzationItem(h) }
    ]); });
    var testDays = testData.map(function (t) { return ([
        parseDate(t[TESTDATA_DATE_COLUMN]),
        { date: parseDate(t[TESTDATA_DATE_COLUMN]), tests: parseTestItem(t) }
    ]); });
    var casesMap = immutable_1.Map(caseDays);
    var hospitalzationsAndCasesMap = hospitalizationDays.reduce(// fold hospitalizations into map
    function (p, _a) {
        var d = _a[0], h = _a[1];
        return p.set(d, __assign(__assign({}, p.get(d, h)), { hospitalizations: h.hospitalizations }));
    }, casesMap);
    var daysMap = testDays.reduce(// fold tests into map
    function (p, _a) {
        var d = _a[0], t = _a[1];
        return p.set(d, __assign(__assign({}, p.get(d, t)), { tests: t.tests }));
    }, hospitalzationsAndCasesMap);
    return daysMap;
}
exports.parseDays = parseDays;
//# sourceMappingURL=parse.js.map