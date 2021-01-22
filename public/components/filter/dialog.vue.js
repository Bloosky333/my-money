const FilterDialog = Vue.component("FilterDialog", {
	mixins: [FilterModelMixin],
	props: ["show", "filter", "accounts", "categories"],
	template: `
		<v-dialog
			v-model="show"
			@input="close"
			@keydown.esc="close"
			fullscreen
			hide-overlay
			transition="dialog-bottom-transition"
		>
			<v-card>
				<v-card-title class="d-flex justify-space-between">
					<v-btn text @click="close">
						<v-icon left>mdi-chevron-left</v-icon> Cancel
					</v-btn>
					<v-btn color="orange" @click="saveFilter">
						<v-icon left>mdi-check</v-icon> Save
					</v-btn>
				</v-card-title>
				<v-card-text class="pt-8 font-weight-light">
					<filter-form
						:filter.sync="filter"
						:accounts="accounts"
						:categories="categories"
					></filter-form>
				</v-card-text>
			</v-card>
		</v-dialog>
    `,
	methods: {
		close() {
			this.$emit("update:show", false);
		}
	}
});