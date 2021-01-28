const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["digest", "search", "categories", "accounts"],
	template: `
		<div>
			<kpi-block 
				:digest="digest"
				:search="search"
				class="mt-6"
			></kpi-block>
			
			<balance-block 
				:digest="digest"
				:accounts="accounts"
				@edit="edit"
			></balance-block>
			
			<v-row v-if="digest && digest.accounts">
				<v-col cols="12" lg="6" v-for="chart in charts" class="py-0">
					<stats-block 
						:params="chart"
						:digest="digest"
						:search="search"
						:accounts="accounts"
						:categories="categories"
					></stats-block>
				</v-col>
			</v-row>
        </div>
    `,
	data() {
		return {
			charts: [
				{
					title: "Cashflow",
					chartTypes: "combo,column",
					stat: "cashflow",
					expense: null,
				},
				{
					title: "Income/Expense",
					chartTypes: "combo,column",
					stat: "income-expense",
					expense: null,
				},
				{
					title: "Expense by category",
					chartTypes: "column,line,pie",
					stat: "category",
					expense: true,
				},
				{
					title: "Income by category",
					chartTypes: "column,line,pie",
					stat: "category",
					expense: false,
				},
			]
		}
	},
	methods: {
		edit(type, item) {
			this.$emit("edit", type, item);
		},
	},
});