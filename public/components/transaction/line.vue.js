const TransactionLine = Vue.component("TransactionLine", {
    props: ["transaction", "categories"],
    template: `
        <section-block class="px-4">
            <div v-if="transaction.categoryID" :class="category.color + '--text'">
                <v-icon left>{{ category.icon }}</v-icon>
                {{ category.name }}
            </div>
            <div v-else class="red--text">
                No category
            </div>
            <v-row>
                <v-col cols="8"><small class="font-weight-light">{{ transaction.communications }}</small></v-col>
                <v-col cols="4" class="text-right">
                    <h3 :class="transaction.amount > 0 ? 'green--text' : 'red--text'">{{ transaction.amount }}€</h3>
                    <div>{{ transaction.date | dateToStr(true) }}</div>
                </v-col>
            </v-row>
        </section-block>
    `,
    computed: {
        category() {
            if(this.transaction.categoryID) {
                return _.find(this.categories, c => c.id === this.transaction.categoryID);
            } else {
                return false;
            }
        }
    }
});