const CONST = {
	serverDateFormat: "YYYY-MM-DD HH:mm:ss",
	userDatetimeFormat: "DD/MM/YYYY HH:mm",
	userDateFormat: "DD/MM/YYYY",
	timeFormat: "HH:mm",
	transactionHeaders: {
		"account": "Account",
		"counterpartAccount": "Counterpart Account",
		"counterpartName": "Counterpart Name",
		"date": "Date",
		"amount": "Amount",
		"communications": "Communications"
	},
	banks: [
		{
			name: "Belfius",
			delimiter: ";",
			headerLinesCount: 13,
			dateFormat: "DD/MM/YYYY",
			encoding: "iso-8859-2",
			match: {
				"account": 0,
				"counterpartAccount": 4,
				"counterpartName": 5,
				"date": 9,
				"amount": 10,
				"communications": 14
			},
		}
	]
};