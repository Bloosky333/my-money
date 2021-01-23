const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "categories", "accounts"],
	template: `
        <div>
        	<stats-block 
        		title="Income/Expense by perid"
        		:transactions="transactions"
				:categories="categories"
				chart-type="combo"
				grouping="period"
				period="month"
			></stats-block>
			
        	<stats-block 
        		title="Expense by category"
        		:transactions="transactions"
				:categories="categories"
				chart-type="pie"
				grouping="category"
				:expense="true"
			></stats-block>
			
			<stats-block 
        		title="Income by category"
        		:transactions="transactions"
				:categories="categories"
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