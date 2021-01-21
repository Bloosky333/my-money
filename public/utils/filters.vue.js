Vue.filter('capitalize', function (value) {
    return _.capitalize(value);
});

Vue.filter('round', function (value, precision=2) {
    if(value) {
        return _.round(value, precision);
    } else {
        return 0
    }
});

Vue.filter("strToDate", function (value) {
    if (value) {
        return moment.utc(value, CONST.serverDateFormat).local();
    } else {
        return value;
    }
});

Vue.filter("dateToStr", function (value, dateOnly, timeOnly) {
    if (value) {
        if (dateOnly) {
            return value.format(CONST.userDateFormat);
        } else if (timeOnly) {
            return value.format(CONST.timeFormat);
        } else {
            return value.format(CONST.userDatetimeFormat);
        }
    } else {
        return "";
    }
});