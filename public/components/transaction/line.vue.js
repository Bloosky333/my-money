const TransactionLine = Vue.component("TransactionLine", {
    mixins: [AccountModelMixin, CategoryModelMixin],
    props: ["transaction", "categories", "accounts", "search"],
    template: `
        <section-block>
            <div class="d-flex align-center justify-space-between">
                <category-title :category="category"></category-title>
                <div v-if="!search">{{ account.name }}</div>
                <div v-if="search" class="grey--text"><small>{{ transaction.date | dateToStr(true) }}</small></div>
                <div v-if="search" :class="getAmountColorClass(transaction.amount)">
                    {{ transaction.amount | currency }}
                </div>
            </div>
            <small v-if="search" class="font-weight-light" v-html="highlighted"></small>
            <v-row v-else>
                <v-col cols="8" class="pb-0"><small class="font-weight-light">{{ transaction.communications }}</small></v-col>
                <v-col cols="4" class="text-right pb-0">
                    <h3 :class="getAmountColorClass(transaction.amount)">{{ transaction.amount | currency }}</h3>
                    <div>{{ transaction.date | dateToStr(true) }}</div>
                </v-col>
            </v-row>
        </section-block>
    `,
    computed: {
        category() {
        	if(this.transaction.categoryID) {
				return this.getCategoryByID(this.transaction.categoryID);
			} else {
        		return false;
			}
        },
        account() {
            return this.getAccountByID(this.transaction.accountID);
        },
        highlighted() {
            const text = this.transaction.details || this.transaction.communications;
            return Vue.filter('highlight')(text, this.search);
        },
    }
});