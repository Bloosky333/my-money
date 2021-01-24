const MainPage = Vue.component("MainPage", {
	mixins: [TransactionModelMixin, DigestModelMixin],
	template: `
    <div>
    	<filters-bar
    		:show="page === 'stats' || page === 'transactions'"
    		:search.sync="search"
    		:transactions="transactions"
    		:categories="categoriesOrdered"
    		:accounts="accountsOrdered"
    	></filters-bar>
    	
        <v-container class="page-with-header">
            
            <!-- PAGES ========================== -->
            <stats-page
                v-if="page==='stats'"
<!--                :transactions="filteredTransactions"-->
				:digest="digest
                :search="search"
                @edit="edit"
            ></stats-page>
            
            <transactions-page
                v-if="page==='transactions'"
                :accounts="accountsOrdered"
                :transactions="filteredTransactions"
                :categories="categoriesOrdered"
                :filters="filters"
                :search="search"
                @edit="edit"
                @updated="transactionUpdated"
            ></transactions-page>
            
            <import-page
                v-if="page==='import'"
                :transactions="transactionsOrdered"
                :categories="categoriesOrdered"
                :accounts="accountsOrdered"
                :filters="filters"
                @edit="edit"
                @updated="transactionUpdated"
            ></import-page>
            
            <params-page
                v-if="page==='params'"
                :categories="categoriesOrdered"
                :accounts="accountsOrdered"
                :filters="filters"
                @edit="edit"
            ></params-page>
            
            
            <!-- DIALOGS ========================== -->
            <transaction-dialog
        		:show.sync="showDialog.transaction"
        		:transaction="selected.transaction"
        		:accounts="accountsOrdered"
        		:categories="categoriesOrdered"
        		:filters="filters"
        		@updated="transactionUpdated"
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
        		:accounts="accountsOrdered"
        		:categories="categoriesOrdered"
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
			loaded: false,
			page: "stats",
			transactions: [],
			accounts: [],
			categories: [],
			filters: [],
			digest: {},
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
		"$root.userID": {
			immediate: true,
			async handler(userID) {
				if (userID) {
					const filters = [["userID", "==", userID]];
					await Promise.all([
						// this.bindTransactions("transactions", filters),
						this.bindAccounts("accounts", filters),
						this.bindCategories("categories", filters),
						this.bindFilters("filters", filters),
						this.bindDigest(userID),
					]);
					if(!this.digest) {
						await this.updateDigest(userID, {accounts: {}})
					}

					this.search.years = _.clone(this.years);
					this.search.categories = _.clone(this.categories);
					this.search.accounts = _.clone(this.accounts);

					this.$root.loading = false;
				}
			}
		},
		page(val) {
			if((val === "import" || val === "transactions") && !this.transactions.length) {
				const filters = [["userID", "==", userID]];
				// this.bindTransactions("transactions", filters);
			}
		}
	},
	computed: {
		accountsOrdered() {
			return _.sortBy(this.accounts, c => c.name);
		},
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

			const allYears = this.search.years.length === this.years.length;
			const allAccounts = this.search.accounts.length === this.accounts.length;
			const allCategories = this.search.categories.length === this.categories.length;

			return this.transactionsOrdered.filter(t => {
				return (
					(!years.length || allYears || years.includes(t.year)) &&
					(!accountIds.length || allAccounts || accountIds.includes(t.accountID)) &&
					(!categoryIds.length || allCategories || categoryIds.includes(t.categoryID))
				)
			});
		},
	},
	methods: {
		edit(type, item = {}) {
			this.showDialog[type] = true;
			this.selected[type] = item;
		},
		transactionUpdated() {
			this.saveDigest(this.digest, this.transactions);
		},
	}
});