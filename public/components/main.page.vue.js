const MainPage = Vue.component("MainPage", {
    mixins: [TransactionMixin],
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
                :transactions.sync="transactions"
            ></stats-page>
            
            <transactions-page
                v-if="page==='transactions'"
                :transactions.sync="transactions"
            ></transactions-page>
            
            <import-page
                v-if="page==='import'"
                :transactions.sync="transactions"
            ></import-page>
            
            <params-page
                v-if="page==='params'"
                :categories.sync="categories"
            ></params-page>
            
            <div class="mt-12 text-caption font-weight-thin text--grey text-center">
                Next IT © 2021
            </div>
        </v-container>
        <navigation :page.sync="page" :loaded="loaded"></navigation>
    </div>
    `,
    data() {
        return {
            transactions: false,
            categories: false,
            loaded: false,
            page: "import",
        }
    },
    watch: {
        "$root.currentUser": {
            immediate: true,
            handler(user) {
                if (user) {
                    const filters = [];
                    filters.push(["userID", "==", this.$root.userID]);
                    this.bindTransactions("transactions", filters);
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