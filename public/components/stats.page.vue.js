const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "search"],
	template: `
        <div>
        	<stats-block 
        		title="Income/Expense by period"
        		:transactions="transactions"
				:categories="search.categories"
				chart-type="combo"
				grouping="period"
				:period="search.period"
			></stats-block>
			
        	<stats-block 
        		title="Expense by category"
        		:transactions="transactions"
				:categories="search.categories"
				chart-type="pie"
				grouping="category"
				:expense="true"
			></stats-block>
			
			<stats-block 
        		title="Income by category"
        		:transactions="transactions"
				:categories="search.categories"
				chart-type="pie"
				grouping="category"
				:expense="false"
			></stats-block>
        </div>
    `,
	data() {
		return {

		}
	},
	computed: {
	},
	methods: {

	}
});