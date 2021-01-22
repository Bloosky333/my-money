const CategoryDialog = Vue.component("CategoryDialog", {
	mixins: [CategoryModelMixin],
	props: ["show", "category"],
	template: `
		<dialog-block :show.sync="show" @save="saveAndClose">
			<v-text-field
				label="Name"
				v-model="category.name"
			></v-text-field>
			
			<v-text-field
				label="Icon"
				v-model="category.icon"
			></v-text-field>
			
			<v-text-field
				label="Color"
				v-model="category.color"
			></v-text-field>
			
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
	computed: {

	},
	methods: {
		saveAndClose() {
			this.saveCategory(this.category);
			this.show = false;
		},
		deleteAndClose() {
			this.deleteFilter(this.category.id);
			this.show = false;
		}
	}
});