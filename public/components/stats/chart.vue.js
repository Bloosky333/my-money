const StatsChart = Vue.component("StatsChart", {
	components: {
		highcharts: HighchartsVue.Chart
	},
	props: ["type", "data", "stack"],
	template: `
		<highcharts :options="chartOptions" ref="chart"></highcharts>
    `,
	computed: {
		charType() {
			return CONST.chartMatch[this.type]
		},
		chartOptions() {
			const options = {};
			_.merge(options, CONST.chartOptions.common, CONST.chartOptions[this.type]);
			options.xAxis.categories = this.data.headers;
			options.series = this.data.series;
			options.plotOptions.column.stacking = this.stack ? "normal" : false;
			// if (this.type === "combo") {
			// 	options.series = {};
			// 	const lastColumnIndex = this.data[0].length - 2;
			// 	options.series[lastColumnIndex] = {type: 'line'};
			// }
			console.log("Chart Options", options);
			return options;
		},
	},
	methods: {}
});