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
			>
				<template v-slot:item.Income="{ item }">
					{{ item.Income | round }}€
				</template>
				<template v-slot:item.Expense="{ item }">
					{{ item.Expense | round }}€
				</template>
				<template v-slot:item.Total="{ item }">
					{{ item.Total | round }}€
				</template>
			</v-data-table>
        </div>
    `,
	data() {
		return {
			search: "",
		}
	},
	computed: {
		table() {
			let headers = [], items = [];
			this.data.forEach((line, i) => {
				if(i === 0) {
					line.forEach((value, j) => {
						headers.push({
							text: value,
							value: value,
							align: j > 0 ? 'right' : "left"
						})
					});
				} else {
					const item = {};
					line.forEach((value, j) => {
						item[headers[j].value] = value;
					});
					items.push(item);
				}
			});

			return {
				headers,
				items,
			}
		},
	},
	methods: {}
});