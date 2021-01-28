const StatsChart = Vue.component("StatsChart", {
	components: {
		highcharts: HighchartsVue.Chart
	},
	props: ["type", "data"],
	template: `
		<div style="width: 100%; overflow-x: auto;">
			<div :style="style">
				<highcharts :options="chartOptions" ref="chart"></highcharts>
			</div>
		</div>
    `,
	computed: {
		chartOptions() {
			const options = {};
			_.merge(options, CONST.chartOptions);
			options.chart.type = this.type;
			options.xAxis.categories = this.data.headers;
			options.series = this.data.series;
			options.plotOptions.column.stacking = this.data.stack ? "normal" : false;
			if(this.type === "pie") {
				options.xAxis.visible = false;
			}
			return options;
		},
		style() {
			const style = {};
			if(this.type !== "pie") {
				style.minWidth = (50 * this.data.headers.length) + 'px';
			}
			return style;
		}
	},
});