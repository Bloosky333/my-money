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
				line.amount = line.amount.replace(" €", "").replace(",", ".").replaceAll(" ", "");
			},
			match: {
				"date": 0,
				"amount": 2,
				"communications": 1
			},
		}
	],
	chartIcon: {
		"pie": "mdi-chart-pie",
		"column": "mdi-chart-bar",
		"combo": "mdi-chart-areaspline",
		"line": "mdi-chart-line",
	},
	chartOptions: {
		credits: {enabled: false},
		title: false,
		chart: {
			backgroundColor: null,
			style: {
				fontFamily: "Roboto"
			},
		},
		xAxis: {
			visible: true,
			categories: [] // headers
		},
		yAxis: {
			title: false,
			stackLabels: {
				enabled: true,
				formatter: function () {
					let sum = 0;
					const series = this.axis.series;
					for (let i in series) {
						if (series[i].visible &&
							series[i].options.stacking === 'normal' &&
							series[i].options.stack === this.stack
						) {
							sum += series[i].yData[this.x];
						}
					}
					if (this.total > 0) {
						return Highcharts.numberFormat(sum, 1);
					} else {
						return '';
					}
				}
			}
		},
		plotOptions: {
			column: {
				dataLabels: {
					enabled: true
				}
			},
			pie: {
				innerSize: "50%",
				dataLabels: {
					enabled: true,
					format: '<b>{point.name}</b>: {point.y: .2f}€ ({point.percentage:.0f}%)'
				}
			}
		},
		series: []
	},
};