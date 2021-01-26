const FilterSelectDialog = Vue.component("FilterSelectDialog", {
	props: ["show", "search", "years", "accounts", "categories", "type"],
	template: `
		<dialog-block :show.sync="show" back-only="true">
			<template v-slot:action>
				<div>
					<v-btn text color="orange darken-2" @click="clear">
						<v-icon left>mdi-checkbox-blank-outline</v-icon> None
					</v-btn>
					<v-btn text color="orange darken-2" @click="reset">
						<v-icon left>mdi-checkbox-marked</v-icon> All
					</v-btn>
				</div>
			</template>
			
			<v-row>
				<v-col cols="6" v-for="item in items">
					<v-checkbox
						v-model="search[type]"
						:label="item.name || item"
						:value="item.id || item"
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
			this.search[this.type] = this[this.type].map(x => x.id || x);
		},
	}
});