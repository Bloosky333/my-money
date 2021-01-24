const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "search"],
	template: `
        <div>
        	<stats-block 
        		title="Income/Expense"
        		:transactions="transactions"
				:categories="search.categories"
				chart-types="combo"
				grouping="period"
				:period="search.period"
			></stats-block>
			
        	<stats-block 
        		title="Expense by category"
        		:transactions="transactions"
				:categories="search.categories"
				chart-types="pie,line,column"
				grouping="category"
				:expense="true"
				:period="search.period"
			></stats-block>
			
			<stats-block 
        		title="Income by category"
        		:transactions="transactions"
				:categories="search.categories"
				chart-types="pie,line,column"
				grouping="category"
				:expense="false"
				:period="search.period"
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