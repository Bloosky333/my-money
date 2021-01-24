const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["digest", "search", "digest"],
	template: `
        <div>
        	<stats-block 
        		title="Income/Expense"
        		:digest="digest"
				:categories="search.categories"
				chart-types="combo"
				grouping="period"
				:period="search.period"
			></stats-block>
			
        	<stats-block 
        		title="Expense by category"
        		:digest="digest"
				:categories="search.categories"
				chart-types="pie,line,column"
				grouping="category"
				:expense="true"
				:period="search.period"
			></stats-block>
			
			<stats-block 
        		title="Income by category"
        		:digest="digest"
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