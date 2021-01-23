const TransactionModelMixin = {
	mixins: [ModelMixin, FilterModelMixin, AccountModelMixin, CategoryModelMixin],
	data() {
		return {
		}
	},
	methods: {
		saveTransaction(transaction) {
			const id = transaction.id;
			if (id) {
				console.log("UPDATE");
				return this.updateTransaction(id, transaction)
			} else {
				console.log("CREATE", transaction);
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
