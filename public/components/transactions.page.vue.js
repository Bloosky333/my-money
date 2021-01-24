const TransactionsPage = Vue.component("TransactionsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "accounts", "categories", "filters"],
	template: `
        <div>
        	<v-btn text block @click="processTransactions">
        		<v-icon left>mdi-auto-fix</v-icon>
        		Find Match
        		<span v-if="changed"> - Changed : {{ changed }}</span>
			</v-btn>
        	
        	<transaction-block 
        		v-for="(section, i) in sections" 
        		:section="section"
        		:accounts="accounts"
				:categories="categories"
				@edit="edit"
				:expanded="i === 0"
			></transaction-block>
        </div>
    `,
	data() {
		return {
			changed: 0,
		}
	},
	computed: {
		sections() {
			const sections = [];
			const uncategorized = {
				name: "Uncategorized",
				transactions: [],
			};
			const undated = {
				name: "Undated",
				transactions: [],
			};

			let section = {
				name: "",
			};
			this.transactions.forEach(transaction => {
				if(transaction.categoryID) {
					const date = dateToMoment(transaction.date);

					if(date) {
						const name = date.format("YYYY MMMM");

						if(name !== section.name){
							section = {
								name: name,
								transactions: [],
							};
							sections.push(section);
						}
						section.transactions.push(transaction);
					} else {
						undated.transactions.push(transaction);
					}
				} else {
					uncategorized.transactions.push(transaction);
				}
			});

			sections.unshift(undated);
			sections.unshift(uncategorized);

			sections.forEach(this.sumSection);
			return sections.filter(section => section.transactions.length > 0);
		},
	},
	methods: {
		sumSection(section) {
			section.income = 0;
			section.expense = 0;
			section.transactions.forEach(t => {
				if(t.amount > 0) {
					section.income += t.amount;
				} else {
					section.expense += t.amount;
				}
			});
			section.total = section.income + section.expense;
		},
		processTransactions() {
			this.changed = 0;
			this.transactions.forEach(transaction => {
				const changed = this.autoFillTransaction(transaction);
				if(changed) {
					this.saveTransaction(transaction);
					this.changed ++;
				}
			})
		},
		edit(transaction) {
			this.$emit("edit", "transaction", transaction);
		},
	}
});