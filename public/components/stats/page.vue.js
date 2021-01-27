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
			
			<v-row>
				<v-col cols="12" md="6" lg="4" v-for="chart in charts" class="py-0">
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
					title: "Income/Expense",
					chartTypes: "column,combo",
					stat: "period",
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