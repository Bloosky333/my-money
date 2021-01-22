const TransactionsPage = Vue.component("TransactionsPage", {
	mixins: [],
	props: ["transactions"],
	template: `
        <div>
        	<section-title>Transactions</section-title>
        	
        	<transaction-line
				v-for="transaction in transactions"
				:transaction="transaction"
			></transaction-line>
        </div>
    `,
	data() {
		return {
		}
	},
	created() {
	},
	computed: {
	},
	methods: {
	}
});