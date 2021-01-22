const ImportLine = Vue.component("ImportLine", {
    props: ["transaction", "status"],
    template: `
        <section-block class="px-4">
            <v-row>
                <v-col cols="4" class="pb-0">{{ transaction.account }}</v-col>
                <v-col cols="8" class="text-right pb-0">
                    <span v-if="transaction.counterpartName">{{ transaction.counterpartName }} / </span>
                    {{ transaction.counterpartAccount }}
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="8"><small class="font-weight-light">{{ transaction.communications }}</small></v-col>
                <v-col cols="4" class="text-right">
                    <h3 :class="transaction.amount > 0 ? 'green--text' : 'red--text'">{{ transaction.amount }}€</h3>
                    <div>{{ transaction.date | dateToStr(true) }}</div>
                </v-col>
            </v-row>
            <div class="text-center">
                <v-progress-circular
                    v-if="status.processing"
                    indeterminate
                    color="orange"
                ></v-progress-circular>
                <v-icon v-else-if="status.status==='success'" color="green">mdi-check-circle</v-icon>
                <v-icon v-else-if="status.status==='ignored'" color="blue">mdi-debug-step-over</v-icon>
                <v-icon v-else-if="status.status==='error'" color="orange">mdi-alert</v-icon>
            </div>
        </section-block>
    `,
});