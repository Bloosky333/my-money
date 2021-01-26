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
			idField: (line) => {

			},
			match: {
				"account": 0,
				"counterpartAccount": 4,
				"counterpartName": 5,
				"date": 9,
				"amount": 10,
				"details": 8,
				"communications": 14
			},
		},
		{
			name: "BNP",
			delimiter: ";",
			headerLinesCount: 13,
			dateFormat: "DD-MM-YY",
			encoding: "iso-8859-2",
			idField: "reference",
			match: {
				"reference": 0,
				"account": 7,
				"counterpartAccount": 5,
				"counterpartName": 9,
				"date": 2,
				"amount": 3,
				"details": 6,
				"communications": 8
			},
		}

	],
	chartMatch: {
		"pie": 	"PieChart",
		"column": "ColumnChart",
		"combo": "ComboChart",
		"line": "LineChart",
	},
	chartIcon: {
		"pie": 	"mdi-chart-pie",
		"column": "mdi-chart-bar",
		"combo": "mdi-chart-areaspline",
		"line": "mdi-chart-line",
	},
	chartOptions: {
		common: {
			height: 250,
			backgroundColor: {fill: 'transparent'},
			chartArea: {
				left: "15%",
				top: 5,
				width: '80%',
				height: '75%'
			},
			hAxis: {
				textStyle: {
					color: "white"
				}
			},
			vAxis: {
				format: "short",
				textStyle: {
					color: "white"
				}
			},
			legend: {
				position: 'bottom',
				alignment: "center",
				textStyle: {
					fontName: "Roboto",
					color: "white"
				}
			},
		},
		pie: {
			is3D: true,
			pieHole: 0.2,
			pieSliceTextStyle: {
				fontName: "Roboto",
				fontSize: 16,
			},
			chartArea: {
				left: 0,
				top: 0,
				width: '100%',
				height: '100%'
			},
			legend: {
				alignment: "center",
				textStyle: {
					fontName: "Roboto",
					color: "white"
				}
			},
		},
		column: {

		},
		combo: {
			isStacked: true,
			seriesType: 'bars',
		},
		line: {

		},

	}
};