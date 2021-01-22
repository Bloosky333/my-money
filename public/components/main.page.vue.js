const MainPage = Vue.component("MainPage", {
    mixins: [TransactionModelMixin, AccountModelMixin, CategoryModelMixin, FilterModelMixin],
    template: `
    <div>
<!--        <character-status-bar -->
<!--            :character="character"-->
<!--            :page="page"-->
<!--            :loaded="loaded"-->
<!--            @action="runAction"-->
<!--        ></character-status-bar>-->
        
        <v-container class="page-with-header">
            <stats-page
                v-if="page==='stats'"
                :accounts.sync="accounts"
                :transactions.sync="transactions"
                :categories.sync="categories"
                :filters.sync="filters"
            ></stats-page>
            
            <transactions-page
                v-if="page==='transactions'"
                :accounts.sync="accounts"
                :transactions.sync="transactions"
                :categories.sync="categories"
                :accounts.sync="categories"
                :filters.sync="filters"
            ></transactions-page>
            
            <import-page
                v-if="page==='import'"
                :transactions.sync="transactions"
                :categories.sync="categories"
                :filters.sync="filters"
            ></import-page>
            
            <params-page
                v-if="page==='params'"
                :categories.sync="categories"
                :accounts.sync="accounts"
                :filters.sync="filters"
            ></params-page>
            
            <div class="my-12 text-caption font-weight-thin text--grey text-center">
                Next IT © 2021
            </div>
        </v-container>
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
            page: "transactions",
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
    methods: {
        runAction(action) {
            switch (action) {
                case "selectCharacter":
                    break;
            }
        }
    }
});