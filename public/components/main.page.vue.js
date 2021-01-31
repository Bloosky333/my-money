const MainPage = Vue.component("MainPage", {
	mixins: [TransactionModelMixin, DigestModelMixin, UserModelMixin],
	template: `
    <div v-if="digest">
    	<filters-bar
    		:show="page === 'stats' || page === 'transactions'"
    		:search.sync="search"
    		:transactions="transactions"
    		:categories="categoriesOrdered"
    		:accounts="accountsOrdered"
    		:years="digest.years"
    		:digest="digest"
    		@updateDigest="saveDigest(digest)"
    		ref="filterBar"
    	></filters-bar>
    	
        <v-container class="page-with-header">
            <!-- PAGES ========================== -->
            <v-slide-x-transition>
				<stats-page
					v-show="page==='stats'"
					:digest="digest"
					:search="search"
					:accounts="accountsOrdered"
					:categories="categoriesOrdered"
					@edit="edit"
					@refresh="refreshDigest"
				></stats-page>
            </v-slide-x-transition>
            
            <v-slide-x-transition>
				<transactions-page
					v-show="page==='transactions'"
					:accounts="accountsOrdered"
					:transactions="filteredTransactions"
					:categories="categoriesOrdered"
					:filters="filters"
					:search="search"
					@edit="edit"
					@refresh="refreshDigest"
				></transactions-page>
            </v-slide-x-transition>
            
            <v-slide-x-transition>
				<import-page
					v-show="page==='import'"
					:transactions="transactionsOrdered"
					:categories="categoriesOrdered"
					:accounts="accountsOrdered"
					:filters="filters"
					@edit="edit"
					@refresh="refreshDigest"
				></import-page>
            </v-slide-x-transition>
            
            <v-slide-x-transition>
				<params-page
					v-show="page==='params'"
					:categories="categoriesOrdered"
					:accounts="accountsOrdered"
					:filters="filters"
					@edit="edit"
					@logout="processLogout"
				></params-page>
            </v-slide-x-transition>
            
            <!-- DIALOGS ========================== -->
            <transaction-dialog
        		:show.sync="showDialog.transaction"
        		:transaction="selected.transaction"
        		:accounts="accountsOrdered"
        		:categories="categoriesOrdered"
        		:filters="filters"
        		@refresh="refreshDigest"
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
        	<div class="my-12 grey--text text-center nextit-credit">
        		<div class="text-uppercase font-weight-bold">My Money v1.2</div>
            	<div class="font-weight-light"><small>Next IT © 2021</small></div>
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
			transactionBound: false,
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
				years: [],
				categories: [],
				accounts: [],
				allYears: true,
				allAccounts: true,
				allCategories: true,
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
						this.bindAccounts("accounts", filters),
						this.bindCategories("categories", filters),
						this.bindFilters("filters", filters),
						this.bindDigest(userID),
					]);
					if(!this.digest) {
						await this.updateDigest(userID, {years: [], search: []})
					}

					this.search.years = _.clone(this.digest.years || []);
					this.search.categories = this.categories.map(c => c.id);
					this.search.accounts = this.accounts.map(a => a.id);

					this.$root.loading = false;
				}
			}
		},
		page(page) {
			if(page === "import" || page === "transactions") {
				this.bindTransactionsOnce();
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
			return this.transactionsOrdered.filter(t => {
				return (
					(this.search.allYears || this.search.years.includes(t.year)) &&
					(this.search.allAccounts || this.search.accounts.includes(t.accountID)) &&
					(this.search.allCategories || this.search.categories.includes(t.categoryID))
				)
			});
		},
	},
	methods: {
		bindTransactionsOnce() {
			if(!this.transactionBound) {
				this.transactionBound = true;
				const filters = [["userID", "==", this.$root.userID]];
				return this.bindTransactions("transactions", filters);
			}
		},
		edit(type, item = {}) {
			this.showDialog[type] = true;
			this.selected[type] = item;
		},
		refreshDigest() {
			this.$nextTick(async ()=> {
				await this.bindTransactionsOnce();
				this.saveDigest(this.digest, this.transactions);
			});
		},
		processLogout() {
			this.$root.processLogout();
			this.$unbind("accounts");
			this.$unbind("categories");
			this.$unbind("filters");
			this.$unbind("digest");
		},
	}
});