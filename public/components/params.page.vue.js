const ParamsPage = Vue.component("ParamsPage", {
	mixins: [StatsMixin],
	props: ["categories", "accounts", "filters"],
	template: `
		<div>
			<v-row>
				<v-col cols="12" md="6" lg="4" class="py-0">
					<section-title
						btn-label="Add"
						btn-icon="mdi-plus"
						@action="edit('account')"
					>Accounts</section-title>
					<account-line
						v-for="account in accounts"
						:account="account"
						@click.native="edit('account', account)"
					></account-line>
				</v-col>
				
				<v-col cols="12" md="6" lg="4" class="py-0">
					<section-title
						btn-label="Add"
						btn-icon="mdi-plus"
						@action="edit('category')"
					>Categories</section-title>
					<section-block
						v-for="category in categories"
					>
						<div class="d-flex align-center justify-space-between" @click="edit('category', category)">
							<div>
								<v-icon left :color="category.color" class="mt-n1">{{ category.icon }}</v-icon>
								{{ category.name }}
							</div>
						</div>
					</section-block>
				</v-col>
				
				<v-col cols="12" md="6" lg="4" class="py-0">
					<section-title
						btn-label="Add"
						btn-icon="mdi-plus"
						@action="edit('filter')"
					>Filter</section-title>
					<filter-block
						v-for="section in filterSections"
						:section="section"
						:accounts="accounts"
						:categories="categories"
						@edit="edit"
					></filter-block>
				</v-col>
			</v-row>
        
        	<v-btn 
				text small 
				color="grey"
				@click="logout"
				block
				class="mt-12"
			><v-icon left>mdi-logout</v-icon> Logout</v-btn>
        </div>
    `,
	computed: {
		filterSections() {
			const categories = {};
			this.filters.forEach(filter => {
				if(!categories[filter.categoryID]) {
					categories[filter.categoryID] = {
						name: this._getCategoryName(filter.categoryID),
						filters: []
					};
				}
				categories[filter.categoryID].filters.push(filter);
			});

			const orderedCategories = [];
			_.forEach(categories, category => {
				orderedCategories.push(category);
			});
			return _.orderBy(orderedCategories, "name");
		}
	},
	methods: {
		edit(type, item) {
			this.$emit("edit", type, item);
		},
		logout() {
			this.$emit("logout");
		}
	}
});