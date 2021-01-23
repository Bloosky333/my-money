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
	],
	chartOptions: {
		pie: {
			is3D: true,
			height: 300,
			pieHole: 0.2,
			backgroundColor: {fill: 'transparent'},
			chartArea: {
				left: 0,
				top: 0,
				width: '90%',
				height: '100%'
			},
			pieSliceTextStyle: {
				fontName: "Roboto",
				fontSize: 16,
			},
			legend: {
				alignment: "center",
				textStyle: {
					fontName: "Roboto",
					fontSize: 16,
					color: "white"
				}
			},
		}
	}
};