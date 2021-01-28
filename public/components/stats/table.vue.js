const StatsTable = Vue.component("StatsTable", {
	mixins: [],
	props: ["data"],
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

			this.data.series.forEach(item => {
				headers.push({
					text: item.name,
					value: item.name,
					align: 'right'
				});
			});

			const items = this.data.headers.map((header, i) => {
				const line = {
					name: header
				};
				this.data.series.forEach(item => {
					line[item.name] = item.data[i];
				});
				return line;
			});

			return {
				headers,
				items,
			}
		},
	},
	methods: {}
});