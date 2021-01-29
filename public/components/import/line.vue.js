const ImportLine = Vue.component("ImportLine", {
    props: ["transaction", "error"],
    template: `
        <section-block class="px-4">
            <div class="d-flex justify-space-between mb-2">
                <div class="grey--text">
                    <v-icon color="grey" left class="mt-n1">mdi-pound-box</v-icon> 
                    {{ transaction.transactionID }}
                </div>
                <div :class="transaction.amount > 0 ? 'green--text' : 'red--text'" class="font-weight-bold">
                    {{ transaction.amount | currency }}
                </div>
            </div>
            <div class="d-flex justify-space-between">
                <div class="font-weight-light">
                    {{ transaction.account }}
                </div>
                <div>{{ transaction.date | dateToStr(true) }}</div>
            </div>
            <div class="font-weight-light">
                {{ transaction.counterpartAccount }}
                <span v-if="transaction.counterpartName">({{ transaction.counterpartName }})</span>
            </div>
            <div class="mt-2 transaction-details grey--text">
                {{ transaction.details || transaction.communications}}
            </div>
            <div v-if="error" class="mt-2 transaction-details error--text">
                {{ error }}
            </div>
        </section-block>
    `,
});