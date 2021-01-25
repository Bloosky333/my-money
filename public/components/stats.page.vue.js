const StatsPage = Vue.component("StatsPage", {
	mixins: [TransactionModelMixin],
	props: ["digest", "search", "categories", "accounts"],
	template: `
        <div>
        	<stats-block 
        		title="Income/Expense"
        		:digest="digest"
				:search="search"
				:accounts="accounts"
                :categories="categories"
				chart-types="combo"
				grouping="period"
			></stats-block>
			
        	<stats-block 
        		title="Expense by category"
        		:digest="digest"
				:search="search"
				:accounts="accounts"
                :categories="categories"
				chart-types="pie,line,column"
				grouping="category"
				:expense="true"
			></stats-block>
<!--			-->
<!--			<stats-block -->
<!--        		title="Income by category"-->
<!--        		:digest="digest"-->
<!--				:search="search"-->
<!--				:accounts="accounts"-->
<!--                :categories="categories"-->
<!--				chart-types="pie,line,column"-->
<!--				grouping="category"-->
<!--				:expense="false"-->
<!--			></stats-block>-->
        </div>
    `,
});