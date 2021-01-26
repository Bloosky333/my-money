const TransactionModelMixin = {
	mixins: [ModelMixin, FilterModelMixin, AccountModelMixin, CategoryModelMixin],
	data() {
		return {
		}
	},
	computed: {
		// years() {
		// 	const years = [];
		// 	this.transactions.forEach(t => {
		// 		if(t.year && !years.includes(t.year)) {
		// 			years.push(t.year);
		// 		}
		// 	});
		// 	return years;
		// },
	},
	methods: {
		saveTransaction(transaction) {
			const id = transaction.id;
			transaction.amount = transaction.amount ? parseFloat(transaction.amount) : 0;
			const date = dateToMoment(transaction.date);

			if(date instanceof moment) {
				transaction.year = date.year();
				transaction.month = date.format("MM");
			}

			if (id) {
				return this.updateTransaction(id, transaction)
			} else {
				return this.createTransaction(transaction)
			}
		},
		autoFillTransaction(transaction) {
			let changed = false;
			if(!transaction.accountID && transaction.account) {
				const account = this.findAccount(transaction.account);
				if(account) {
					transaction.accountID = account.id;
					changed = true;
				}
			}
			if(!transaction.categoryID) {
				const filter = this.findMatchFilter(transaction);
				if(filter) {
					transaction.categoryID = filter.categoryID;
					changed = true;
				}
			}

			return changed;
		},
		delay: ms => new Promise(res => setTimeout(res, ms)),

		bindTransaction(id, varName) {
			return this.bind(id, "transactions", varName || 'transaction');
		},
		bindTransactions(varName, filters) {
			return this.bindCollection("transactions", filters, varName || "transactions")
		},
		createTransaction(data) {
			data.userID = this.$root.userID;
			return this.create(data, "transactions");
		},
		updateTransaction(id, data) {
			return this.update(id, data, "transactions");
		},
		deleteTransaction(id) {
			return this.remove(id, "transactions")
		},
	}
};
