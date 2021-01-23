const StatsChart = Vue.component("StatsChart", {
	mixins: [],
	props: ["data", "options", "type"],
	template: `
        <GChart
            :type="charType"
            :data="data"
            :options="options"
        ></GChart>
    `,
	computed: {
		charType() {
			switch (this.type) {
				case "pie":
					return "PieChart";
				default:
					return "";
			}
		}
	},
	methods: {}
});