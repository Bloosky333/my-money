const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "categories", "accounts"],
	template: `
        <div>
        	<section-title>Stats</section-title>
        	
        	<category-chart
        		:transactions="transactions"
        		:categories="categories"
        	></category-chart>
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