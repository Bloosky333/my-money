const TransactionBlock = Vue.component("TransactionBlock", {
    mixins: [TransactionModelMixin],
    props: ["section", "categories", "accounts", "expanded"],
    template: `
        <div>
            <section-title
                expandable="true"
                :expanded.sync="expanded"
            >{{ section.name }} ({{ section.transactions.length }})</section-title>
            
            <v-expand-transition>
                <div v-if="expanded">
                    <transaction-line
                        v-for="transaction in section.transactions"
                        :transaction="transaction"
                        :accounts="accounts"
                        :categories="categories"
                        @click.native="edit(transaction)"
                    ></transaction-line>
                </div>
            </v-expand-transition>
        </div>
    `,
    computed: {
        category() {
            return this.getCategoryByID(this.transaction.categoryID);
        },
        account() {
            return this.getAccountByID(this.transaction.accountID);
        }
    },
    methods: {
        edit(transaction) {
            this.$emit("edit", transaction)
        }
    }
});