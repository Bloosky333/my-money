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

function dateToMoment(value) {
    let date;
    if(value instanceof firebase.firestore.Timestamp) {
        date = moment(value.toDate())
    } else if (value instanceof Date) {
        date = moment(value);
    } else {
        date = value;
    }
    return date;
}
Vue.filter("dateToStr", function (value, dateOnly, timeOnly) {
    if (value) {
        const date = dateToMoment(value);
        if (dateOnly) {
            return date.format(CONST.userDateFormat);
        } else if (timeOnly) {
            return date.format(CONST.timeFormat);
        } else {
            return date.format(CONST.userDatetimeFormat);
        }
    } else {
        return "";
    }
});