const StatsChart = Vue.component("StatsChart", {
	mixins: [],
	props: ["data", "type"],
	template: `
        <GChart
            :data="data"
            :type="charType"
            :options="chartOptions"
        ></GChart>
    `,
	computed: {
		charType() {
			return CONST.chartMatch[this.type]
		},
		chartOptions() {
			const options = {};
			Object.assign(options, CONST.chartOptions.common, CONST.chartOptions[this.type]);
			if (this.type === "combo") {
				options.series = {};
				const lastColumnIndex = this.data[0].length - 2;
				options.series[lastColumnIndex] = {type: 'line'};
			}
			return options;
		},
	},
	methods: {}
});