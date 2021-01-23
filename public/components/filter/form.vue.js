const FilterForm = Vue.component("FilterForm", {
	mixins: [FilterModelMixin],
	props: ["filter", "accounts", "categories"],
	template: `
		<div>
			<section-block class="px-4">
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
					v-model="filter.counterpartAccount"
				></v-text-field>
			</section-block>
			
			<section-title
				btn-label="Add"
				btn-icon="mdi-plus"
				@action="addContains"
			>Communications contains</section-title>
			<section-block v-for="(text, i) in filter.contains" class="py-0">
				<div class="d-flex align-center">
					<span>and</span>
					<v-text-field
						placeholder="Something ..."
						v-model="filter.contains[i]"
						solo
						dense
						single-line
						hide-details
						class="ml-2"
						flat
					></v-text-field>
					<v-icon 
						small
						color="grey"
						@click="removeContains(i)"
						class="ml-3"
					>mdi-delete</v-icon>
				</div>
			</section-block>
		</div>
    `,
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
	}
});