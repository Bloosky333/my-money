const StatsChart = Vue.component("StatsChart", {
	components: {
		highcharts: HighchartsVue.Chart
	},
	props: ["type", "data"],
	template: `
		<highcharts :options="chartOptions" ref="chart"></highcharts>
    `,
	computed: {
		chartOptions() {
			const options = {};
			_.merge(options, CONST.chartOptions);
			options.chart.type = this.type;
			options.xAxis.categories = this.data.headers;
			options.series = this.data.series;
			options.plotOptions.column.stacking = this.data.stack ? "normal" : false;
			if (this.type === "pie") {
				options.xAxis.visible = false;
				options.chart.scrollablePlotArea.minWidth = 1;
			} else {
				options.chart.scrollablePlotArea.minWidth = this.width;
			}
			return options;
		},
		width() {
			const dataCount = this.data.series[0].data.length;
			const seriesCount = this.data.series.length;

			let total = 0;
			if(this.data.stack || this.data.group) {
				total = dataCount;
			} else {
				total = dataCount * seriesCount;
			}
			return 50 * total;
		}
	},
});