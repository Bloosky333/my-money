const MainPage = Vue.component("MainPage", {
	mixins: [TransactionModelMixin],
	template: `
    <div>
<!--        <character-status-bar -->
<!--            :character="character"-->
<!--            :page="page"-->
<!--            :loaded="loaded"-->
<!--            @action="runAction"-->
<!--        ></character-status-bar>-->
        
        <v-container class="page-with-header">
            
            <!-- PAGES ========================== -->
            <stats-page
                v-if="page==='stats'"
                :accounts="accounts"
                :transactions="transactionsOrdered"
                :categories="categoriesOrdered"
                @edit="edit"
            ></stats-page>
            
            <transactions-page
                v-if="page==='transactions'"
                :accounts="accounts"
                :transactions="transactionsOrdered"
                :categories="categories"
                :filters="filters"
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
            color="orange"
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
		}
	},
	watch: {
		"$root.currentUser": {
			immediate: true,
			handler(user) {
				if (user) {
					const filters = [];
					filters.push(["userID", "==", this.$root.userID]);
					this.bindTransactions("transactions", filters, "amount desc");
					this.bindAccounts("accounts", filters);
					this.bindCategories("categories", filters);
					this.bindFilters("filters", filters);
				}
			}
		},
	},
	computed: {
		categoriesOrdered() {
			return _.sortBy(this.categories, c => c.name);
		},
		transactionsOrdered() {
			return _.sortBy(this.transactions, t => t.date ? t.date.valueOf() : 0).reverse();
		},
	},
	methods: {
		edit(type, item = {}) {
			this.showDialog[type] = true;
			this.selected[type] = item;
		},
	}
});