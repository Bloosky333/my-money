const TransactionSearch = Vue.component("TransactionSearch", {
	props: ["transactions", "search", "categories", "accounts"],
	template: `
		<div>
			<section-title>Results ({{ searchResults.length }})</section-title>
			<transaction-block-summary :section="searchTotals"></transaction-block-summary> 
			
			<transaction-line
				v-for="transaction in searchResults"
				:transaction="transaction"
				v-bind="$props"
				@click.native="edit(transaction)"
			></transaction-line>
		</div>
    `,
	data() {
		return {
		}
	},
	computed: {
		searchResults() {
			const query = this.search.toLowerCase();
			return this.transactions.filter(t => {
				const text = t.details || t.communications;
				return text && text.toLowerCase().includes(query)
			});
		},
		searchTotals() {
			const totals = {
				income: 0,
				expense: 0,
				total: 0,
			};
			this.searchResults.forEach(t => {
				if (t.amount > 0) {
					totals.income += t.amount;
				} else {
					totals.expense += t.amount;
				}
			});
			totals.total = totals.income - totals.expense;
			return totals;
		},
	},
	methods: {
		edit(transaction) {
			this.$emit("edit", transaction);
		},
	}
});