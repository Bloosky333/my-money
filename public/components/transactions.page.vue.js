const TransactionsPage = Vue.component("TransactionsPage", {
	mixins: [TransactionModelMixin],
	props: ["transactions", "accounts", "categories", "filters"],
	template: `
        <div>
        	<div v-if="transactions.length">
				<div class="d-flex justify-space-around">
					<v-btn text @click="processTransactions" :loading="processing">
						<v-icon left small>mdi-auto-fix</v-icon>
						Find Match
						<span v-if="changed"> - Changed : {{ changed }}</span>
					</v-btn>
					<v-btn text @click="refreshDigest" :loading="refreshing">
						<v-icon left small>mdi-refresh</v-icon> Refresh Digest
					</v-btn>
				</div>
				
				<transaction-block 
					v-for="(section, i) in sections" 
					:section="section"
					:accounts="accounts"
					:categories="categories"
					@edit="edit"
					:expanded="i === 0"
				></transaction-block>
			</div>
			
			<div v-else class="text-center py-4">
                <v-progress-linear indeterminate color="orange darken-2"></v-progress-linear>
            </div>
        </div>
    `,
	data() {
		return {
			changed: 0,
			refreshing: false,
			processing: false,
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
				if (transaction.categoryID) {
					const date = dateToMoment(transaction.date);

					if (date) {
						const name = date.format("YYYY MMMM");

						if (name !== section.name) {
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
				if (t.amount > 0) {
					section.income += t.amount;
				} else {
					section.expense += t.amount;
				}
			});
			section.total = section.income + section.expense;
		},
		async processTransactions() {
			this.processing = true;
			this.changes = 0;
			let changed, transaction;
			for(let i = 0; i<this.transactions.length; i++) {
				transaction = this.transactions[i];
				changed = this.autoFillTransaction(transaction);
				if (changed) {
					this.saveTransaction(transaction);
					this.changes++;
				}
			}
			this.transactions.forEach(transaction => {

			});
			if (this.changes > 0) {
				this.$emit('refresh');
			}
			await this.delay(1000);
			this.processing = false;
		},
		async refreshDigest() {
			this.refreshing = true;
			this.$emit("refresh");
			await this.delay(1000);
			this.refreshing = false;
		},
		edit(transaction) {
			this.$emit("edit", "transaction", transaction);
		},
	}
});