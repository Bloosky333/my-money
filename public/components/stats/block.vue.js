const StatsBlock = Vue.component("StatsBlock", {
    props: ["title", "transactions", "accounts", "categories", "chartType", "grouping", "expense", "period"],
    template: `
        <section-block>
            <div class="section-title grey--text mb-4">{{ title }}</div>
            <div v-if="transactions.length">
                <stats-chart 
                    :type="chartType" 
                    :data="data"
                ></stats-chart>
                
                <div class="d-flex align-center justify-space-between text-overline mt-2 grey--text" @click="toggle">
                    <div v-if="expanded">Hide details</div>
                    <div v-else>Show details</div>
                    <v-icon small>{{ toggleIcon }}</v-icon>
                </div>
                <div v-if="expanded" class="mt-2">
                    <v-expand-transition>
                        <stats-table :data="data"></stats-table>
                    </v-expand-transition>
                </div>
            </div>
            <div v-else class="text-center py-4">
                <v-progress-linear indeterminate color="orange darken-2"></v-progress-linear>
            </div>
        </section-block>
    `,
    data() {
        return {
            expanded: false,
        }
    },
    computed: {
        toggleIcon() {
            return this.expanded ? 'mdi-chevron-up' : 'mdi-chevron-down';
        },
        data() {
            const functionName = _.camelCase("get data by " + this.grouping);
            return this[functionName]();
        },
        reverseTransaction() {
            return this.transactions.slice().reverse();
        }
    },
    methods: {
        // PERIOD
        getDataByPeriod() {
            const data = [];
            data.push(["Period", "Income", "Expense", "Total"]);

            const periods = this.groupTransactionsByPeriod();
            periods.forEach(period => {
                data.push(this.sumPeriod(period));
            });
            return data;
        },
        groupTransactionsByPeriod() {
            const periods = [];
            let period = {
                name: ""
            };
            const dateFormat = this.period === "month" ? "MM/YY" : "YYYY";
            this.reverseTransaction.forEach(transaction => {
                const date = dateToMoment(transaction.date);

                if(date) {
                    const name = date.format(dateFormat);
                    if(name !== period.name){
                        period = {
                            name: name,
                            transactions: [],
                        };
                        periods.push(period);
                    }
                    period.transactions.push(transaction);
                }
            });
            return periods;
        },
        sumPeriod(period) {
            let income = 0;
            let expense = 0;

            period.transactions.forEach(t => {
                if(t.amount > 0) {
                    income += t.amount;
                } else {
                    expense += t.amount;
                }
            });

            return [period.name, income, expense, income + expense];
        },


        // CATEGORY
        getDataByCategory() {
            const data = [];
            data.push(["Category", "Amount"]);
            data.push(["Uncategorized", this.sumByCategory()]);
            this.categories.forEach(c => {
                data.push([c.name, this.sumByCategory(c.id)]);
            });
            return data;
        },
        sumByCategory(id){
            let total = 0;
            this.transactions.forEach(t => {
                if(
                    (this.expense && t.amount < 0) ||
                    (!this.expense && t.amount > 0)
                ) {
                    let amount = 0;
                    if(!id) {
                        amount = t.categoryID ? 0 : t.amount;
                    } else {
                        amount = t.categoryID === id ? t.amount : 0;
                    }

                    total += amount;
                }
            });
            return Math.abs(total);
        },

        toggle() {
            this.expanded = !this.expanded;
        }
    }
});