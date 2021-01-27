const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["digest", "search", "categories", "accounts"],
	template: `
        <v-row>
        	<v-col cols="12" md="6" lg="4" v-for="chart in charts" class="py-0">
        		<stats-block 
					:title="chart.title"
					:chart-types="chart.chartTypes"
					:grouping="chart.grouping"
					:expense="chart.expense"
					:digest="digest"
					:search="search"
					:accounts="accounts"
					:categories="categories"
				></stats-block>
        	</v-col>
        </v-row>
    `,
	data() {
		return {
			charts: [
				{
					title: "Income/Expense",
					chartTypes: "column,combo",
					grouping: "period",
					expense: null,
				},
				{
					title: "Expense by category",
					chartTypes: "column,line,pie",
					grouping: "category",
					expense: true,
				},
				{
					title: "Income by category",
					chartTypes: "column,line,pie",
					grouping: "category",
					expense: false,
				},
			]
		}
	}
});