const MainPage = Vue.component("MainPage", {
	mixins: [TransactionModelMixin],
	template: `
    <div>
    	<filters-bar
    		:show="page === 'stats' || page === 'transactions'"
    		:search.sync="search"
    		:transactions="transactions"
    		:categories="categories"
    		:accounts="accounts"
    	></filters-bar>
    	
        <v-container class="page-with-header">
            
            <!-- PAGES ========================== -->
            <stats-page
                v-if="page==='stats'"
                :accounts="accounts"
                :transactions="filteredTransactions"
                :categories="categoriesOrdered"
                :search="search"
                @edit="edit"
            ></stats-page>
            
            <transactions-page
                v-if="page==='transactions'"
                :accounts="accounts"
                :transactions="transactionsOrdered"
                :categories="categories"
                :filters="filters"
                :search="search"
                @edit="edit"
            ></transactions-page>
            
            <import-page
                v-if="page==='import'"
                :transactions="transactionsOrdered"
                :categories="categories"
                :filters="filters"
                @edit="edit"
            ></import-page>
            
            <params-page
                v-if="page==='params'"
                :categories="categoriesOrdered"
                :accounts="accounts"
                :filters="filters"
                @edit="edit"
            ></params-page>
            
            
            <!-- DIALOGS ========================== -->
            <transaction-dialog
        		:show.sync="showDialog.transaction"
        		:transaction="selected.transaction"
        		:accounts="accounts"
        		:categories="categories"
        		:filters="filters"
        	></transaction-dialog>
            
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
        	
        	<!-- COPYRIGHT ========================== -->
            <div class="my-12 text-caption font-weight-thin text--grey text-center">
                Next IT © 2021
            </div>
        </v-container>
        
        
        <!-- FAB ========================== -->
        <v-btn
            fab fixed 
            class="fab-center"
            color="orange darken-2"
            @click="edit('transaction')"
        ><v-icon>mdi-plus</v-icon></v-btn>
        
        <!-- NAVIGATION ========================== -->
        <navigation :page.sync="page" :loaded="loaded"></navigation>
    </div>
    `,
	data() {
		return {
			transactions: [],
			accounts: [],
			categories: [],
			filters: [],
			loaded: false,
			page: "stats",
			showDialog: {
				transaction: false,
				account: false,
				category: false,
				filter: false,
			},
			selected: {
				transaction: false,
				account: false,
				category: false,
				filter: false,
			},
			search: {
				period: "year",
				years: [],
				categories: [],
				accounts: [{}]
			},
		}
	},
	watch: {
		"$root.currentUser": {
			immediate: true,
			async handler(user) {
				if (user) {
					const filters = [["userID", "==", this.$root.userID]];
					await Promise.all([
						this.bindTransactions("transactions", filters, "amount desc"),
						this.bindAccounts("accounts", filters),
						this.bindCategories("categories", filters),
						this.bindFilters("filters", filters),
					]);
					this.search.years = _.clone(this.years);
					this.search.categories = _.clone(this.categories);
					this.search.accounts = _.clone(this.accounts);

					this.$root.loading = false;
				}
			}
		},
	},
	computed: {
		categoriesOrdered() {
			return _.sortBy(this.categories, c => c.name);
		},
		transactionsOrdered() {
			return _.sortBy(this.transactions, t => t.date ? t.date.seconds : 0).reverse();
		},
		filteredTransactions() {
			const years = this.search.years;
			const accountIds = this.search.accounts.map(a => a.id);
			const categoryIds = this.search.categories.map(c => c.id);

			const ts = this.transactionsOrdered.filter(t => {
				return (
					(!years.length || years.includes(t.year)) &&
					(!accountIds.length || accountIds.includes(t.accountID)) &&
					(!categoryIds.length || categoryIds.includes(t.categoryID))
				)
			});
			return ts;
		},
	},
	methods: {
		edit(type, item = {}) {
			this.showDialog[type] = true;
			this.selected[type] = item;
		},
	}
});