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
Vue.filter('highlight', function(words, query){
    const iQuery = new RegExp(query, "ig");
    return words.toString().replace(iQuery, function(matchedTxt,a,b){
        return ('<span class="highlight">' + matchedTxt + '</span>');
    });
});
Vue.filter('signedNumber', function(value){
    if(value >= 0) {
        return "+" + String(value);
    } else {
        return value;
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