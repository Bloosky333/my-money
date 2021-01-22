const EditFilterDialog = Vue.component("EditFilterDialog", {
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
					<v-btn color="orange" @click="save">
						<v-icon left>mdi-check</v-icon> Save
					</v-btn>
				</v-card-title>
				<v-card-text class="pt-8 font-weight-light">
					<v-autocomplete
						label="Category to assign"
						v-model="filter.categoryID"
						:items="categories"
						item-text="name"
						item-value="id"
					></v-autocomplete>
					
					<v-autocomplete
						label="Account"
						v-model="filter.accountID"
						:items="accounts"
						item-text="name"
						item-value="id"
					></v-autocomplete>
					
					<v-text-field
						label="Counterpart account"
						v-model="filter.counterpart_account"
					></v-text-field>
					
					<section-title
						btn-label="Add"
						btn-icon="mdi-plus"
						@action="addContains"
					>Communications contains</section-title>
					<section-block v-for="text in filter.contains">
						<div class="d-flex align-center">
							<span>and</span>
							<v-text-field
								placeholder="Something ..."
								v-model="text"
								solo
								dense
								single-line
								hide-details
								class="ml-2"
								flat
							></v-text-field>
						</div>
					</section-block>
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
		addContains() {
			if(!this.filter.contains) {
				this.$set(this.filter, "contains", []);
			}
			this.filter.contains.push("");
		},
		removeContains(index) {
			this.filter.contains.splice(index, 1);
		},
		save() {
			const id = this.filter.id;
			if(id) {
				this.updateFilter(id, this.filter)
			} else {
				this.createFilter(this.filter)
			}
			this.close();
		},
		close() {
			this.$emit("update:show", false);
		}
	}
});