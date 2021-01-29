const TransactionSearch = Vue.component("TransactionSearch", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "search", "categories", "filters"],
	template: `
		<div>
			<section-title>Results ({{ searchResults.length }})</section-title>
			<transaction-block-summary :section="searchTotals"></transaction-block-summary> 
			
			<section-block v-for="line in searchResults" class="py-1" @click.native="edit(line)">
				<v-row dense>
					<v-col cols="8">
						<small class="font-weight-light" v-html="$options.filters.highlight(line.communications, search)"></small>
					</v-col>
					<v-col cols="4" class="text-right">
						<div :class="line.amount > 0 ? 'success--text' : 'error--text'">{{ line.amount | currency}}</div>
						<div>{{ line.date | dateToStr(true) }}</div>
					</v-col>
				</v-row>
			</section-block>
		</div>
    `,
	data() {
		return {
		}
	},
	computed: {
		searchResults() {
			const query = this.search.toLowerCase();
			return this.transactions.filter(t => t.communications && t.communications.toLowerCase().includes(query));
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