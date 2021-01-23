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
			return Object.assign({}, CONST.chartOptions.common, CONST.chartOptions[this.type]);
		},
	},
	methods: {}
});