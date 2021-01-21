const CONST = {
	serverDateFormat: "YYYY-MM-DD HH:mm:ss",
	userDatetimeFormat: "DD/MM/YYYY HH:mm",
	userDateFormat: "DD/MM/YYYY",
	timeFormat: "HH:mm",
	transactionHeaders: {
		"account": "Account",
		"counterpart_account": "Counterpart Account",
		"counterpart_name": "Counterpart Name",
		"date": "Date",
		"amount": "Amount",
		"communications": "Communications"
	},
	banks: [
		{
			name: "Belfius",
			delimiter: ",",
			match: {
				"account": 0,
				"counterpart_account": 4,
				"counterpart_name": 5,
				"date": 1,
				"amount": 10,
				"communications": 14
			}
		}
	]
};