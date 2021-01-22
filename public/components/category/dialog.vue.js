const CategoryDialog = Vue.component("CategoryDialog", {
	mixins: [CategoryModelMixin],
	props: ["show", "category"],
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
					<v-btn color="orange" @click="save">
						<v-icon left>mdi-check</v-icon> Save
					</v-btn>
				</v-card-title>
				<v-card-text class="pt-8 font-weight-light">
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
				</v-card-text>
			</v-card>
		</v-dialog>
    `,
	data() {
		return {
		}
	},
	computed: {

	},
	methods: {
		save() {
			const id = this.category.id;
			if(id) {
				this.updateCategory(id, this.category)
			} else {
				this.createCategory(this.category)
			}
			this.close();
		},
		close() {
			this.$emit("update:show", false);
		}
	}
});