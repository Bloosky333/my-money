const TransactionBlock = Vue.component("TransactionBlock", {
    mixins: [TransactionModelMixin],
    props: ["section", "categories", "accounts", "expanded"],
    template: `
        <div>
            <section-title
                expandable="true"
                :expanded.sync="expanded"
                margin-bottom="1"
            >{{ section.name }} ({{ section.count }})</section-title>
            <transaction-block-summary :section="section"></transaction-block-summary> 
             
            <section-block class="pt-1" color="#252525">
                <template v-for="(ss, i) in section.subSections">
                    <section-title
                        expandable="true"
                        :expanded.sync="ssExpanded[i]"
                        margin-bottom="0"
                        margin-top="3"
                    >{{ ss.name }} ({{ ss.transactions.length }})</section-title>
                    <transaction-block-summary :section="ss"></transaction-block-summary> 
                    
                    <v-expand-transition>
                        <div v-if="ssExpanded[i]">
                            <transaction-line
                                v-for="transaction in ss.transactions"
                                :transaction="transaction"
                                :accounts="accounts"
                                :categories="categories"
                                @click.native="edit(transaction)"
                            ></transaction-line>
                        </div>
                    </v-expand-transition>
                </template>
            </section-block>
        </div>
    `,
    data() {
        const ssExpanded = [];
        this.section.subSections.forEach(s => {
            ssExpanded.push(this.expanded);
        });
        return {
            ssExpanded: ssExpanded,
        }
    },
    watch: {
        expanded(val) {
            this.section.subSections.forEach((s, i) => {
               this.ssExpanded[i] = val;
            });
        }
    },
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

const TransactionBlockSummary = Vue.component("TransactionBlockSummary", {
    props: ["section"],
    template: `
        <v-row dense no-gutters>
            <v-col class="py-0 pr-1" cols="4">
                <section-block class="py-1">
                    <v-icon small left color="success">mdi-trending-up</v-icon>
                    <small>{{ section.income | currency }} </small>
                </section-block>
            </v-col>
            <v-col class="py-0 pr-1" cols="4">
                <section-block class="py-1">
                    <v-icon small left color="error">mdi-trending-down</v-icon>
                    <small>{{ Math.abs(section.expense) | currency }}</small>
                </section-block>
            </v-col>
            <v-col class="py-0" cols="4">
                <section-block class="py-1">
                    <v-icon small left :color="section.total > 0 ? 'success' : 'error'">mdi-sigma</v-icon>
                    <small>{{ section.total | currency }}</small>
                </section-block>
            </v-col>
        </v-row>
    `,
});