const StatsTable = Vue.component("StatsTable", {
	props: ["data", "type"],
	template: `
		<div>
			<v-text-field
				v-model="search"
				placeholder="Search"
				single-line
				dense
				hide-details
				solo
				prepend-inner-icon="mdi-magnify"
				flat
				class="mb-2"
			></v-text-field>
			<v-data-table
				:headers="table.headers"
				:items="table.items"
				:items-per-page="5"
				:search="search"
				dense
				:mobile-breakpoint="100"
				:footer-props="{itemsPerPageText: ''}"
			></v-data-table>
        </div>
    `,
	data() {
		return {
			search: "",
		}
	},
	computed: {
		table() {
			const headers = [{
				text: this.data.headerName,
				value: "name",
			}];
			let items = [];

			if(this.type === "pie") {
				headers.push({
					text: "Amount",
					value: "amount",
					align: "right"
				}, {
					text: "Percent",
					value: "percent",
					align: "right"
				});

				let total = 0;
				this.data.series[0].data.forEach(item => {
					items.push({
						name: item[0],
						amount: item[1],
					});
					total += item[1];
				});
				items.forEach(item => {
					item.percent = _.round(item.amount / total * 100) + "%";
				});
			} else {
				this.data.series.forEach(item => {
					headers.push({
						text: item.name,
						value: item.name,
						align: 'right'
					});
				});

				items = this.data.headers.map((header, i) => {
					const line = {
						name: header
					};
					this.data.series.forEach(item => {
						line[item.name] = item.data[i];
					});
					return line;
				});
			}

			return {
				headers,
				items,
			}
		},
	},
	methods: {}
});