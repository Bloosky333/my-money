const StatsBlock = Vue.component("StatsBlock", {
    props: ["title", "digest", "accounts", "categories", "chartTypes", "grouping", "expense", "period"],
    template: `
        <section-block>
            <div class="section-title grey--text mb-4 d-flex justify-space-between align-center">
                <div>{{ title }}</div>
                <v-btn-toggle 
                    v-model="chartType" 
                    borderless 
                    mandatory
                    color="orange darken-2"
                >
                    <v-btn 
                        v-for="type in chartTypesArray"
                        small
                        :value="type"
                    ><v-icon>{{ CONST.chartIcon[type] }}</v-icon></v-btn> 
                </v-btn-toggle>
            </div>
            <div v-if="digest.accounts">
                <stats-chart 
                    v-if="chartType"
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
            chartType: false,
        }
    },
    created() {
        this.chartType = this.chartTypesArray[0];
    },
    computed: {
        chartTypesArray() {
            return  this.chartTypes.split(',');
        },
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
            let periods;
            switch(this.chartType) {
                case "pie":
                    data.push(["Category", "Amount"]);
                    data.push(["Uncategorized", this.sumByCategory(false, this.transactions)]);
                    this.categories.forEach(c => {
                        data.push([c.name, this.sumByCategory(c.id, this.transactions)]);
                    });
                    break;
                case "line":
                    const categoryNames = this.categories.map(c => c.name);
                    data.push(["Period", ...categoryNames]);

                    periods = this.groupTransactionsByPeriod();
                    periods.forEach(period => {
                        const sumsByCategory = this.categories.map(c => {
                            return this.sumByCategory(c.id, period.transactions);
                        });
                        data.push([period.name, ...sumsByCategory])
                    });
                    break;
                case "column":
                    periods = this.groupTransactionsByPeriod();
                    const periodNames = periods.map(p => p.name);
                    data.push(["Category", ...periodNames]);

                    this.categories.forEach(c => {
                        const sumsByPeriod = periods.map(period => {
                            return this.sumByCategory(c.id, period.transactions);
                        });
                        data.push([c.name, ...sumsByPeriod]);
                    });

                    break;
            }

            return data;
        },
        sumByCategory(categoryID, transactions){
            let total = 0;
            transactions.forEach(t => {
                if(
                    (this.expense && t.amount < 0) ||
                    (!this.expense && t.amount > 0)
                ) {
                    let amount = 0;
                    if(!categoryID) {
                        amount = t.categoryID ? 0 : t.amount;
                    } else {
                        amount = t.categoryID === categoryID ? t.amount : 0;
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