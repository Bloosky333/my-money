const ParamsPage = Vue.component("ParamsPage", {
	mixins: [],
	props: ["categories", "accounts", "filters"],
	template: `
        <div>
        	<section-title
        		btn-label="Add"
        		btn-icon="mdi-plus"
        		@action="editAccount"
        	>Accounts</section-title>
        	<section-block
        		v-for="account in accounts"
        	>
        		<div class="d-flex align-center justify-space-between" @click="editAccount(account)">
        			<div>
        				<v-icon left class="mt-n1">mdi-bank</v-icon>
        				{{ account.name }}
        			</div>
        			<div>{{ account.number }}</div>
        		</div>
        	</section-block>
        	
        	<section-title
        		btn-label="Add"
        		btn-icon="mdi-plus"
        		@action="editCategory"
        	>Categories</section-title>
        	<section-block
        		v-for="category in categories"
        	>
        		<div class="d-flex align-center justify-space-between" @click="editCategory(category)">
        			<div>
        				<v-icon left :color="category.color" class="mt-n1">{{ category.icon }}</v-icon>
        				{{ category.name }}
        			</div>
        		</div>
        	</section-block>
        	
        	<section-title
        		btn-label="Add"
        		btn-icon="mdi-plus"
        		@action="editFilter"
        	>Filter</section-title>
        	<filter-line
        		v-for="filter in filters"
        		:filter="filter"
        		:accounts="accounts"
        		:categories="categories"
        		@click.native="editFilter(filter)"
        	></filter-line>
        	
			<!-- DIALOGS -->
        	<account-dialog
        		:show.sync="showDialog.account"
        		:account="selected.account"
        	></account-dialog>
        	<category-dialog
        		:show.sync="showDialog.category"
        		:category="selected.category"
        	></category-dialog>
        	<filter-dialog
        		:show.sync="showDialog.filter"
        		:filter="selected.filter"
        		:accounts="accounts"
        		:categories="categories"
        	></filter-dialog>
        </div>
    `,
	data() {
		return {
			showDialog: {
				account: false,
				category: false,
				filter: false,
			},
			selected: {
				account: false,
				category: false,
				filter: false,
			},

		}
	},
	computed: {
	},
	methods: {
		editAccount(account = {}) {
			this.showDialog.account = true;
			this.selected.account = account;
		},
		editCategory(category = {}) {
			this.showDialog.category = true;
			this.selected.category = category;
		},
		editFilter(filter = {}) {
			this.showDialog.filter = true;
			this.selected.filter = filter;
		},

	}
});