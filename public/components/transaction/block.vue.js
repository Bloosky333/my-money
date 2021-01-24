const TransactionBlock = Vue.component("TransactionBlock", {
    mixins: [TransactionModelMixin],
    props: ["section", "categories", "accounts", "expanded"],
    template: `
        <div>
            <section-title
                expandable="true"
                :expanded.sync="expanded"
            >{{ section.name }} ({{ section.transactions.length }})</section-title>
            <v-row dense no-gutters class="mt-n2">
                <v-col class="py-0 pr-1" cols="4">
                    <section-block class="py-1">
                        <v-icon small left color="success">mdi-trending-up</v-icon>
                        <small>{{ section.income | round }}€ </small>
                    </section-block>
                </v-col>
                <v-col class="py-0 pr-1" cols="4">
                    <section-block class="py-1">
                        <v-icon small left color="error">mdi-trending-down</v-icon>
                        <small>{{ Math.abs(section.expense) | round }}€</small>
                    </section-block>
                </v-col>
                <v-col class="py-0" cols="4">
                    <section-block class="py-1">
                        <v-icon small left :color="section.total > 0 ? 'success' : 'error'">mdi-sigma</v-icon>
                        <small>{{ section.total | round }}€</small>
                    </section-block>
                </v-col>
                
            </v-row>
            
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