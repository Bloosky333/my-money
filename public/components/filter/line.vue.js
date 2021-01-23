const FilterLine = Vue.component("FilterLine", {
    props: ["filter", "accounts", "categories"],
    template: `
        <section-block>
            <v-row no-gutters dense>
                <v-col cols="6" class="pb-0">
                    <v-icon left small class="mt-n1">mdi-bank</v-icon> {{ account.name }}
                </v-col>
                <v-col cols="auto" class="pb-0 text-center">
                    <v-icon>mdi-transfer-right</v-icon>
                </v-col>
                <v-col class="text-right pb-0">
                    <v-icon left small :color="category.color" class="mt-n1">{{ category.icon }}</v-icon> 
                    {{ category.name }}
                </v-col>
            </v-row>
            <div>
                <v-chip
                    v-if="filter.counterpartAccount"
                    small
                    class="mr-05 mt-05 font-weight-light"
                >{{ filter.counterpartAccount }}</v-chip>
                <v-chip
                    v-for="text in filter.contains"
                    small
                    class="mr-05 mt-05 font-weight-light"
                >{{ text }}</v-chip>
            </div>
            <div class="text-center">
                <v-progress-circular
                    v-if="status.processing"
                    indeterminate
                    color="orange darken-2"
                ></v-progress-circular>
                <v-icon v-else-if="status.status==='success'" color="green">mdi-check-circle</v-icon>
                <v-icon v-else-if="status.status==='ignored'" color="blue">mdi-debug-step-over</v-icon>
                <v-icon v-else-if="status.status==='error'" color="orange darken-2">mdi-alert</v-icon>
            </div>
        </section-block>
    `,
    computed: {
        account() {
            const id = this.filter.accountID;
            if(id) {
                return _.find(this.accounts, a => a.id === id);
            } else {
                return {};
            }
        },
        category() {
            const id = this.filter.categoryID;
            if(id) {
                return _.find(this.categories, c => c.id === id);
            } else {
                return {};
            }
        }

    }
});