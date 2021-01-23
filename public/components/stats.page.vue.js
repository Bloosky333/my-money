const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "categories", "accounts"],
	template: `
        <div>
        	<stats-block 
        		title="Expense by category"
        		:transactions="transactions"
				:categories="categories"
				chart-type="pie"
				grouping="category"
				expense="true"
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