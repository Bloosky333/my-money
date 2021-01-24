const ParamsPage = Vue.component("ParamsPage", {
	mixins: [UserModelMixin],
	props: ["categories", "accounts", "filters"],
	template: `
        <div>
        	<section-title
        		btn-label="Add"
        		btn-icon="mdi-plus"
        		@action="edit('account')"
        	>Accounts</section-title>
        	<section-block
        		v-for="account in accounts"
        	>
        		<div class="d-flex align-center justify-space-between" @click="edit('account', account)">
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
        	
        	<section-title
        		btn-label="Add"
        		btn-icon="mdi-plus"
        		@action="edit('filter')"
        	>Filter</section-title>
        	<filter-line
        		v-for="filter in filters"
        		:filter="filter"
        		:accounts="accounts"
        		:categories="categories"
        		@click.native="edit('filter', filter)"
        	></filter-line>
        	
			<v-btn 
				text small 
				color="grey"
				@click="logout"
				block
				class="mt-8"
			><v-icon left>mdi-logout</v-icon> Logout</v-btn>
        </div>
    `,
	methods: {
		edit(type, item) {
			this.$emit("edit", type, item);
		},
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