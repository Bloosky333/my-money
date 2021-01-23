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
            <stats-page
                v-if="page==='stats'"
                :accounts="accounts"
                :transactions="transactions"
                :categories="categoriesOrdered"
            ></stats-page>
            
            <transactions-page
                v-if="page==='transactions'"
                :accounts="accounts"
                :transactions="transactions"
                :categories="categories"
                :filters="filters"
            ></transactions-page>
            
            <import-page
                v-if="page==='import'"
                :transactions="transactions"
                :categories="categories"
                :filters="filters"
            ></import-page>
            
            <params-page
                v-if="page==='params'"
                :categories="categoriesOrdered"
                :accounts="accounts"
                :filters="filters"
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
            page: "stats",
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