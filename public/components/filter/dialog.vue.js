const FilterDialog = Vue.component("FilterDialog", {
	mixins: [FilterModelMixin],
	props: ["show", "filter", "accounts", "categories"],
	template: `
		<dialog-block :show.sync="show" @save="saveAndClose">
			<filter-form
				:filter.sync="filter"
				:accounts="accounts"
				:categories="categories"
			></filter-form>
			
			<v-btn 
				color="error"
				small
				text
				block
				@click="showConfirm=true"
				class="mt-8 mb-12"
			>
				<v-icon	small left>mdi-delete</v-icon> Delete
			</v-btn> 
			
			<confirm-dialog 
				:show.sync="showConfirm" 
				@confirm="deleteAndClose"
			></confirm-dialog>
		</dialog-block>
    `,
	data() {
		return {
			showConfirm: false,
		}
	},
	watch: {
		show(val) {
			this.$emit('update:show', val);
		}
	},
	methods: {
		saveAndClose() {
			this.saveFilter(this.filter);
			this.show = false;
		},
		deleteAndClose() {
			this.deleteFilter(this.filter.id);
			this.show = false;
		}
	}
});