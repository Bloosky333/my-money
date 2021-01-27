const TransactionLine = Vue.component("TransactionLine", {
    mixins: [AccountModelMixin, CategoryModelMixin],
    props: ["transaction", "categories", "accounts"],
    template: `
        <section-block>
            <div class="d-flex align-center justify-space-between">
                <div v-if="transaction.categoryID" :class="category.color + '--text'">
                    <v-icon left v-if="category.icon">{{ category.icon }}</v-icon>
                    {{ category.name }}
                </div>
                <div v-else class="red--text">
                    No category
                </div>
                <div>{{ account.name }}</div>
            </div>
            
            <v-row>
                <v-col cols="8" class="pb-0"><small class="font-weight-light">{{ transaction.communications }}</small></v-col>
                <v-col cols="4" class="text-right pb-0">
                    <h3 :class="transaction.amount > 0 ? 'green--text' : 'red--text'">{{ transaction.amount }}€</h3>
                    <div>{{ transaction.date | dateToStr(true) }}</div>
                </v-col>
            </v-row>
        </section-block>
    `,
    computed: {
        category() {
            return this.getCategoryByID(this.transaction.categoryID);
        },
        account() {
            return this.getAccountByID(this.transaction.accountID);
        }
    }
});