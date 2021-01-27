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
			idFormatter: (line) => {
				const reference = String(line.reference).padStart(5, "0");
				return "BEFIUS-" + line.date + "-" + reference;
			},
			match: {
				"reference": 3,
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
			headerLinesCount: 1,
			dateFormat: "DD-MM-YY",
			encoding: "iso-8859-2",
			idFormatter(line) {
				return "BNP-" + line.date + "-" + line.reference;
			},
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
		},
		{
			name: "Sodexo",
			delimiter: ";",
			headerLinesCount: 1,
			dateFormat: "DD-MM-YYYY",
			encoding: "iso-8859-2",
			idFormatter(line) {
				const re = /\(Transaction (\d+)\)/i;
				const found = line.communications.match(re);
				let id = "SODEXO-" + line.date + "-";
				id += found ? found[1] : _.kebabCase(_.deburr(line.amount));
				return id;
			},
			formatter(line) {
				line.account = "SODEXO";
				line.amount = line.amount.replace(" €", "").replaceAll(" ", "");
			},
			match: {
				"date": 0,
				"amount": 2,
				"communications": 1
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