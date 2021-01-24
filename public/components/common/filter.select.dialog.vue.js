const FilterSelectDialog = Vue.component("FilterSelectDialog", {
	props: ["show", "search", "years", "accounts", "categories", "type"],
	template: `
		<dialog-block :show.sync="show" back-only="true">
			<template v-slot:action>
				<v-btn text color="orange darken-2" @click="clear">
					<v-icon left>mdi-eraser</v-icon> Clear
				</v-btn>
				<v-btn text color="orange darken-2" @click="reset">
					<v-icon left>mdi-backup-restore</v-icon> Reset
				</v-btn>
			</template>
			
			<v-row>
				<v-col cols="6" v-for="item in items">
					<v-checkbox
						v-model="search[type]"
						:label="item.name || item"
						:value="item"
						color="orange darken-2"
						hide-details
					></v-checkbox>
				</v-col>
			</v-row>
		</dialog-block>
    `,
	data() {
		return {}
	},
	watch: {
		show(val) {
			this.$emit('update:show', val);
		},
		"search.years"(years) {
			this.search.period = years.length === 1 ? "month" : "year";
		}
	},
	computed: {
		items() {
			return this[this.type];
		},
	},
	methods: {
		clear() {
			this.search[this.type] = [];
		},
		reset() {
			this.search[this.type] = _.clone(this[this.type]);
		},
	}
});