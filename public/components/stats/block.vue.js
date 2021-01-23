const StatsBlock = Vue.component("StatsBlock", {
    props: ["title", "transactions", "accounts", "categories", "chartType", "grouping", "expense"],
    template: `
        <section-block>
            <div class="section-title grey--text mb-2">{{ title }}</div>
            <div v-if="transactions.length">
                <stats-chart 
                    :type="chartType" 
                    :data="data"
                    :options="chartOptions"
                ></stats-chart>
                
                <div class="d-flex align-center justify-space-between text-overline mb-2 grey--text" @click="toggle">
                    <div v-if="expanded">Hide details</div>
                    <div v-else>Show details</div>
                    <v-icon small>{{ toggleIcon }}</v-icon>
                </div>
                <div v-if="expanded">
                    <v-expand-transition>
                        <stats-table :data="data"></stats-table>
                    </v-expand-transition>
                </div>
            </div>
            <div v-else class="text-center py-4">
                <v-progress-linear indeterminate color="orange"></v-progress-linear>
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
        chartOptions() {
            return CONST.chartOptions[this.chartType];
        },
        data() {
            const functionName = _.camelCase("get data by " + this.grouping);
            return this[functionName]();
        },
    },
    methods: {
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